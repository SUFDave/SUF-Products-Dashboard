import { Category } from '../data/categories';

export interface Product {
  id: string;
  title: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  inventory: number;
  category: Category;
  imageUrl?: string;
  vendor?: string;
  productType?: string;
  tags?: string[];
  status: 'active' | 'draft' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryUpdate {
  productId: string;
  sku: string;
  newQuantity: number;
  previousQuantity: number;
  timestamp: Date;
}

export interface CategoryStats {
  category: Category;
  totalProducts: number;
  totalInventory: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalInventory: number;
  lowStockItems: number;
  outOfStockItems: number;
  categoryBreakdown: CategoryStats[];
}
