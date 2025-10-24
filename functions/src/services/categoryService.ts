import { Product, CategoryStats, DashboardStats } from '../types/product';
import { CATEGORIES, Category } from '../data/categories';
import { InventoryService } from './inventoryService';

export class CategoryService {
  private inventoryService: InventoryService;

  constructor() {
    this.inventoryService = new InventoryService();
  }

  /**
   * Calculate statistics for a specific category
   */
  async getCategoryStats(category: Category): Promise<CategoryStats> {
    const products = await this.inventoryService.getProductsByCategory(category);

    return {
      category,
      totalProducts: products.length,
      totalInventory: products.reduce((sum, p) => sum + p.inventory, 0),
      lowStockCount: products.filter(p => p.inventory > 0 && p.inventory < 10).length,
      outOfStockCount: products.filter(p => p.inventory === 0).length
    };
  }

  /**
   * Get statistics for all categories
   */
  async getAllCategoryStats(): Promise<CategoryStats[]> {
    const stats: CategoryStats[] = [];

    for (const category of CATEGORIES) {
      const categoryStats = await this.getCategoryStats(category);
      stats.push(categoryStats);
    }

    return stats;
  }

  /**
   * Get overall dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const allProducts = await this.inventoryService.getAllProducts();
    const categoryBreakdown = await this.getAllCategoryStats();

    return {
      totalProducts: allProducts.length,
      totalInventory: allProducts.reduce((sum, p) => sum + p.inventory, 0),
      lowStockItems: allProducts.filter(p => p.inventory > 0 && p.inventory < 10).length,
      outOfStockItems: allProducts.filter(p => p.inventory === 0).length,
      categoryBreakdown
    };
  }

  /**
   * Get products grouped by category
   */
  async getProductsByCategories(): Promise<Record<Category, Product[]>> {
    const result = {} as Record<Category, Product[]>;

    for (const category of CATEGORIES) {
      result[category] = await this.inventoryService.getProductsByCategory(category);
    }

    return result;
  }
}
