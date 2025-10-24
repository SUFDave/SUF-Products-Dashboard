import * as admin from 'firebase-admin';
import { Product } from '../types/product';
import { InventoryService } from './inventoryService';

const db = admin.firestore();

export interface Alert {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'restock';
  productId: string;
  productTitle: string;
  sku: string;
  currentInventory: number;
  message: string;
  severity: 'high' | 'medium' | 'low';
  createdAt: Date;
  resolved: boolean;
}

export class AlertService {
  private alertsCollection = db.collection('alerts');
  private inventoryService: InventoryService;

  constructor() {
    this.inventoryService = new InventoryService();
  }

  /**
   * Check inventory levels and create alerts
   */
  async checkInventoryLevels(): Promise<Alert[]> {
    const lowStockProducts = await this.inventoryService.getLowStockProducts(10);
    const outOfStockProducts = await this.inventoryService.getOutOfStockProducts();
    const alerts: Alert[] = [];

    // Create alerts for out of stock items
    for (const product of outOfStockProducts) {
      const alert = await this.createAlert({
        type: 'out_of_stock',
        productId: product.id,
        productTitle: product.title,
        sku: product.sku,
        currentInventory: 0,
        message: `${product.title} is out of stock`,
        severity: 'high'
      });
      alerts.push(alert);
    }

    // Create alerts for low stock items
    for (const product of lowStockProducts) {
      const alert = await this.createAlert({
        type: 'low_stock',
        productId: product.id,
        productTitle: product.title,
        sku: product.sku,
        currentInventory: product.inventory,
        message: `${product.title} is running low (${product.inventory} remaining)`,
        severity: product.inventory <= 5 ? 'high' : 'medium'
      });
      alerts.push(alert);
    }

    return alerts;
  }

  /**
   * Create a new alert
   */
  async createAlert(alertData: Omit<Alert, 'id' | 'createdAt' | 'resolved'>): Promise<Alert> {
    // Check if alert already exists for this product
    const existingAlerts = await this.alertsCollection
      .where('productId', '==', alertData.productId)
      .where('type', '==', alertData.type)
      .where('resolved', '==', false)
      .get();

    if (!existingAlerts.empty) {
      // Update existing alert
      const existingDoc = existingAlerts.docs[0];
      await existingDoc.ref.update({
        currentInventory: alertData.currentInventory,
        message: alertData.message,
        severity: alertData.severity
      });

      const data = existingDoc.data();
      return {
        id: existingDoc.id,
        ...data,
        createdAt: data.createdAt.toDate()
      } as Alert;
    }

    // Create new alert
    const docRef = await this.alertsCollection.add({
      ...alertData,
      createdAt: admin.firestore.Timestamp.now(),
      resolved: false
    });

    const doc = await docRef.get();
    const data = doc.data()!;

    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt.toDate()
    } as Alert;
  }

  /**
   * Get all active alerts
   */
  async getActiveAlerts(): Promise<Alert[]> {
    const snapshot = await this.alertsCollection
      .where('resolved', '==', false)
      .orderBy('severity', 'desc')
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    } as Alert));
  }

  /**
   * Resolve an alert
   */
  async resolveAlert(alertId: string): Promise<void> {
    await this.alertsCollection.doc(alertId).update({
      resolved: true,
      resolvedAt: admin.firestore.Timestamp.now()
    });
  }

  /**
   * Auto-resolve alerts when inventory is restocked
   */
  async autoResolveAlerts(product: Product): Promise<void> {
    if (product.inventory >= 10) {
      // Resolve low stock alerts
      const lowStockAlerts = await this.alertsCollection
        .where('productId', '==', product.id)
        .where('type', '==', 'low_stock')
        .where('resolved', '==', false)
        .get();

      const batch = db.batch();
      lowStockAlerts.docs.forEach(doc => {
        batch.update(doc.ref, {
          resolved: true,
          resolvedAt: admin.firestore.Timestamp.now()
        });
      });
      await batch.commit();
    }

    if (product.inventory > 0) {
      // Resolve out of stock alerts
      const outOfStockAlerts = await this.alertsCollection
        .where('productId', '==', product.id)
        .where('type', '==', 'out_of_stock')
        .where('resolved', '==', false)
        .get();

      const batch = db.batch();
      outOfStockAlerts.docs.forEach(doc => {
        batch.update(doc.ref, {
          resolved: true,
          resolvedAt: admin.firestore.Timestamp.now()
        });
      });
      await batch.commit();
    }
  }
}
