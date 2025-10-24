import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import StatsCards from './StatsCards';
import CategoryFilter from './CategoryFilter';
import ProductTable from './ProductTable';
import CategoryChart from './CategoryChart';
import LowStockAlerts from './LowStockAlerts';

interface Product {
  id: string;
  title: string;
  sku: string;
  price: number;
  inventory: number;
  category: string;
  imageUrl?: string;
  status: string;
}

interface DashboardStats {
  totalProducts: number;
  totalInventory: number;
  lowStockItems: number;
  outOfStockItems: number;
}

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalInventory: 0,
    lowStockItems: 0,
    outOfStockItems: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to products collection
    const q = query(collection(db, 'products'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];

      setProducts(productsData);
      setFilteredProducts(productsData);
      calculateStats(productsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'ALL') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory, products]);

  const calculateStats = (productsData: Product[]) => {
    setStats({
      totalProducts: productsData.length,
      totalInventory: productsData.reduce((sum, p) => sum + p.inventory, 0),
      lowStockItems: productsData.filter(p => p.inventory > 0 && p.inventory < 10).length,
      outOfStockItems: productsData.filter(p => p.inventory === 0).length
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            SUF Products Dashboard
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Category Chart */}
          <div className="mt-8">
            <CategoryChart products={products} />
          </div>

          {/* Low Stock Alerts */}
          <div className="mt-8">
            <LowStockAlerts products={products} />
          </div>

          {/* Category Filter */}
          <div className="mt-8">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          {/* Product Table */}
          <div className="mt-8">
            <ProductTable products={filteredProducts} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
