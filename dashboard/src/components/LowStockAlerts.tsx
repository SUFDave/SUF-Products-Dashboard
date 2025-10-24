import React, { useMemo } from 'react';

interface Product {
  id: string;
  title: string;
  sku: string;
  inventory: number;
  category: string;
}

interface LowStockAlertsProps {
  products: Product[];
}

const LowStockAlerts: React.FC<LowStockAlertsProps> = ({ products }) => {
  const lowStockProducts = useMemo(() => {
    return products
      .filter(p => p.inventory > 0 && p.inventory < 10)
      .sort((a, b) => a.inventory - b.inventory)
      .slice(0, 10);
  }, [products]);

  const outOfStockProducts = useMemo(() => {
    return products
      .filter(p => p.inventory === 0)
      .slice(0, 10);
  }, [products]);

  if (lowStockProducts.length === 0 && outOfStockProducts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Low Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-2">⚠️</span>
            <h3 className="text-lg font-medium text-gray-900">
              Low Stock Alerts
            </h3>
          </div>
          <div className="space-y-3">
            {lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {product.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    SKU: {product.sku} • {product.category}
                  </p>
                </div>
                <div className="ml-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-200 text-yellow-800">
                    {product.inventory} left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Out of Stock */}
      {outOfStockProducts.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-2">🚫</span>
            <h3 className="text-lg font-medium text-gray-900">
              Out of Stock
            </h3>
          </div>
          <div className="space-y-3">
            {outOfStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {product.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    SKU: {product.sku} • {product.category}
                  </p>
                </div>
                <div className="ml-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-200 text-red-800">
                    Out of stock
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LowStockAlerts;
