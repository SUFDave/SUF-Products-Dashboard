import axios from 'axios';
import { Product } from '../types/product';
import { Category } from '../data/categories';

const ECOMMERCE_API_URL = process.env.ECOMMERCE_API_URL || '';
const API_KEY = process.env.ECOMMERCE_API_KEY || '';

export class EcommerceService {
  /**
   * Fetch all products from the e-commerce platform
   */
  async fetchProducts(): Promise<Product[]> {
    try {
      const response = await axios.get(`${ECOMMERCE_API_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        params: {
          limit: 250,
          status: 'active'
        }
      });

      return this.transformProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products from e-commerce platform');
    }
  }

  /**
   * Transform e-commerce platform data to our Product interface
   */
  private transformProducts(rawProducts: any[]): Product[] {
    return rawProducts.map(product => ({
      id: product.id.toString(),
      title: product.title,
      sku: product.variants?.[0]?.sku || '',
      price: parseFloat(product.variants?.[0]?.price || '0'),
      compareAtPrice: product.variants?.[0]?.compare_at_price
        ? parseFloat(product.variants[0].compare_at_price)
        : undefined,
      inventory: product.variants?.[0]?.inventory_quantity || 0,
      category: this.determineCategory(product),
      imageUrl: product.image?.src || product.images?.[0]?.src,
      vendor: product.vendor,
      productType: product.product_type,
      tags: product.tags?.split(',').map((tag: string) => tag.trim()) || [],
      status: product.status,
      createdAt: new Date(product.created_at),
      updatedAt: new Date(product.updated_at)
    }));
  }

  /**
   * Determine product category based on tags, type, or title
   */
  private determineCategory(product: any): Category {
    const tags = product.tags?.toLowerCase() || '';
    const type = product.product_type?.toLowerCase() || '';
    const title = product.title?.toLowerCase() || '';

    if (tags.includes('seating') || type.includes('chair') || title.includes('chair')) {
      return 'SEATING';
    } else if (tags.includes('desk') || type.includes('desk') || title.includes('desk')) {
      return 'DESKS';
    } else if (tags.includes('storage') || type.includes('storage') || title.includes('cabinet')) {
      return 'STORAGE';
    } else if (tags.includes('table') || type.includes('table') || title.includes('table')) {
      return 'TABLES';
    } else if (tags.includes('lighting') || type.includes('light') || title.includes('lamp')) {
      return 'LIGHTING';
    } else if (tags.includes('accessory') || type.includes('accessory')) {
      return 'ACCESSORIES';
    }

    return 'OTHER';
  }
}
