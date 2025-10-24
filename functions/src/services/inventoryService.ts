import * as admin from 'firebase-admin';
import { Product, InventoryUpdate } from '../types/product';

const db = admin.firestore();

export class InventoryService {
  private productsCollection = db.collection('products');
  private inventoryUpdatesCollection = db.collection('inventoryUpdates');

  /**
   * Sync products to Firestore
   */
  async syncProducts(products: Product[]): Promise<void> {
    const batch = db.batch();
    let operationCount = 0;

    for (const product of products) {
      const docRef = this.productsCollection.doc(product.id);

      // Get existing product to track inventory changes
      const existingDoc = await docRef.get();
      const existingProduct = existingDoc.data() as Product | undefined;

      batch.set(docRef, {
        ...product,
        createdAt: admin.firestore.Timestamp.fromDate(product.createdAt),
        updatedAt: admin.firestore.Timestamp.fromDate(product.updatedAt)
      }, { merge: true });

      operationCount++;

      // If inventory changed, log the update
      if (existingProduct && existingProduct.inventory !== product.inventory) {
        await this.logInventoryUpdate({
          productId: product.id,
          sku: product.sku,
          newQuantity: product.inventory,
          previousQuantity: existingProduct.inventory,
          timestamp: new Date()
        });
      }

      // Firestore batch limit is 500 operations
      if (operationCount === 500) {
        await batch.commit();
        operationCount = 0;
      }
    }

    if (operationCount > 0) {
      await batch.commit();
    }
  }

  /**
   * Get all products from Firestore
   */
  async getAllProducts(): Promise<Product[]> {
    const snapshot = await this.productsCollection.get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as Product;
    });
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(category: string): Promise<Product[]> {
    const snapshot = await this.productsCollection
      .where('category', '==', category)
      .get();

    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as Product;
    });
  }

  /**
   * Get low stock products (inventory < threshold)
   */
  async getLowStockProducts(threshold: number = 10): Promise<Product[]> {
    const snapshot = await this.productsCollection
      .where('inventory', '<', threshold)
      .where('inventory', '>', 0)
      .orderBy('inventory', 'asc')
      .get();

    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as Product;
    });
  }

  /**
   * Get out of stock products
   */
  async getOutOfStockProducts(): Promise<Product[]> {
    const snapshot = await this.productsCollection
      .where('inventory', '==', 0)
      .get();

    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as Product;
    });
  }

  /**
   * Log inventory update
   */
  private async logInventoryUpdate(update: InventoryUpdate): Promise<void> {
    await this.inventoryUpdatesCollection.add({
      ...update,
      timestamp: admin.firestore.Timestamp.fromDate(update.timestamp)
    });
  }

  /**
   * Get recent inventory updates
   */
  async getRecentInventoryUpdates(limit: number = 50): Promise<InventoryUpdate[]> {
    const snapshot = await this.inventoryUpdatesCollection
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        timestamp: data.timestamp.toDate()
      } as InventoryUpdate;
    });
  }
}
