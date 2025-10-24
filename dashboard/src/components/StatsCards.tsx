import React from 'react';

interface StatsCardsProps {
  stats: {
    totalProducts: number;
    totalInventory: number;
    lowStockItems: number;
    outOfStockItems: number;
  };
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: '📦',
      color: 'bg-blue-500'
    },
    {
      title: 'Total Inventory',
      value: stats.totalInventory.toLocaleString(),
      icon: '📊',
      color: 'bg-green-500'
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems,
      icon: '⚠️',
      color: 'bg-yellow-500'
    },
    {
      title: 'Out of Stock',
      value: stats.outOfStockItems,
      icon: '🚫',
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${card.color} rounded-md p-3`}>
                <span className="text-2xl">{card.icon}</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {card.title}
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {card.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
