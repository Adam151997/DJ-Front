import React from 'react';

export const Deals: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Deals</h1>
        <p className="text-gray-600">Manage your sales pipeline</p>
      </div>
      <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-500">Deals pipeline coming soon...</p>
      </div>
    </div>
  );
};