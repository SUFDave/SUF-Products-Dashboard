import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { EcommerceService } from './services/ecommerceService';
import { InventoryService } from './services/inventoryService';
import { CategoryService } from './services/categoryService';
import { AlertService } from './services/alertService';

admin.initializeApp();

const ecommerceService = new EcommerceService();
const inventoryService = new InventoryService();
const categoryService = new CategoryService();
const alertService = new AlertService();

/**
 * Scheduled function to sync products from e-commerce platform
 * Runs every hour
 */
export const syncProducts = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    try {
      console.log('Starting product sync...');

      // Fetch products from e-commerce platform
      const products = await ecommerceService.fetchProducts();
      console.log(`Fetched ${products.length} products`);

      // Sync to Firestore
      await inventoryService.syncProducts(products);
      console.log('Products synced to Firestore');

      // Check for low stock and create alerts
      const alerts = await alertService.checkInventoryLevels();
      console.log(`Created ${alerts.length} alerts`);

      return { success: true, productsCount: products.length, alertsCount: alerts.length };
    } catch (error) {
      console.error('Error syncing products:', error);
      throw error;
    }
  });

/**
 * HTTP endpoint to manually trigger product sync
 */
export const syncProductsManual = functions.https.onRequest(async (req, res) => {
  try {
    console.log('Manual product sync triggered');

    const products = await ecommerceService.fetchProducts();
    await inventoryService.syncProducts(products);
    const alerts = await alertService.checkInventoryLevels();

    res.json({
      success: true,
      message: 'Products synced successfully',
      productsCount: products.length,
      alertsCount: alerts.length
    });
  } catch (error) {
    console.error('Error in manual sync:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to sync products'
    });
  }
});

/**
 * Get dashboard statistics
 */
export const getDashboardStats = functions.https.onRequest(async (req, res) => {
  try {
    const stats = await categoryService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
});

/**
 * Get all products
 */
export const getProducts = functions.https.onRequest(async (req, res) => {
  try {
    const category = req.query.category as string | undefined;

    let products;
    if (category) {
      products = await inventoryService.getProductsByCategory(category);
    } else {
      products = await inventoryService.getAllProducts();
    }

    res.json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
});

/**
 * Get low stock products
 */
export const getLowStockProducts = functions.https.onRequest(async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold as string) || 10;
    const products = await inventoryService.getLowStockProducts(threshold);
    res.json(products);
  } catch (error) {
    console.error('Error getting low stock products:', error);
    res.status(500).json({ error: 'Failed to get low stock products' });
  }
});

/**
 * Get active alerts
 */
export const getActiveAlerts = functions.https.onRequest(async (req, res) => {
  try {
    const alerts = await alertService.getActiveAlerts();
    res.json(alerts);
  } catch (error) {
    console.error('Error getting alerts:', error);
    res.status(500).json({ error: 'Failed to get alerts' });
  }
});

/**
 * Resolve an alert
 */
export const resolveAlert = functions.https.onRequest(async (req, res) => {
  try {
    const alertId = req.body.alertId;
    if (!alertId) {
      res.status(400).json({ error: 'Alert ID is required' });
      return;
    }

    await alertService.resolveAlert(alertId);
    res.json({ success: true, message: 'Alert resolved' });
  } catch (error) {
    console.error('Error resolving alert:', error);
    res.status(500).json({ error: 'Failed to resolve alert' });
  }
});
