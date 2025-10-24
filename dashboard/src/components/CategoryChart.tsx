import React, { useMemo } from 'react';

interface Product {
  id: string;
  category: string;
  inventory: number;
}

interface CategoryChartProps {
  products: Product[];
}

const CategoryChart: React.FC<CategoryChartProps> = ({ products }) => {
  const categoryData = useMemo(() => {
    const categories: Record<string, { count: number; inventory: number }> = {};

    products.forEach(product => {
      if (!categories[product.category]) {
        categories[product.category] = { count: 0, inventory: 0 };
      }
      categories[product.category].count++;
      categories[product.category].inventory += product.inventory;
    });

    return Object.entries(categories).map(([category, data]) => ({
      category,
      count: data.count,
      inventory: data.inventory
    }));
  }, [products]);

  const maxInventory = Math.max(...categoryData.map(d => d.inventory));

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        Inventory by Category
      </h3>
      <div className="space-y-4">
        {categoryData.map((item) => (
          <div key={item.category}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                {item.category}
              </span>
              <div className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">{item.inventory}</span> units
                <span className="mx-2">•</span>
                <span>{item.count} products</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                style={{
                  width: `${(item.inventory / maxInventory) * 100}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryChart;
