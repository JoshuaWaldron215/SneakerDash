"use client";

import React from 'react';
import { useAppSelector } from '@/app/redux';
import { Shoe } from '@/app/state/inventorySlice';
import RevenueProfitChart from '@/app/(components)/RevenueProfitChart';
import ExpensesOverview from '@/app/(components)/ExpensesOverview';

const Dashboard = () => {
  const inventory = useAppSelector((state) => state.inventory.shoes);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Inventory Section */}
      <div className="bg-white shadow-md rounded-lg p-6" style={{ height: '200px', width: '100%' }}>
        <h3 className="text-xl font-semibold mb-4">Your Inventory</h3>
        <div className="overflow-x-auto overflow-y-hidden" style={{ maxHeight: '240px' }}>
          <div className="flex space-x-4">
            {inventory.length > 0 ? (
              inventory.map((shoe: Shoe, index: number) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-60 p-4 bg-gray-100 rounded-lg shadow-sm"
                >
                  <div className="font-semibold text-lg mb-2">{shoe.shoeName}</div>
                  <div className="text-sm text-gray-600">SKU: {shoe.sku}</div>
                  <div className="text-sm text-gray-600">Price: ${shoe.purchasePrice}</div>
                  <div className="text-sm text-gray-600">Date Bought: {shoe.dateBought}</div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No inventory items found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Revenue and Expenses Section */}
      <div className="flex space-x-6">
        {/* Revenue and Profit Chart Section */}
        <div className="bg-white shadow-md rounded-lg p-6" style={{ height: '500px', width: '70%' }}>
          <h3 className="text-xl font-semibold mb-4">Revenue and Profit Overview</h3>
          <div className="w-full h-full">
            <RevenueProfitChart />
          </div>
        </div>

        {/* Expenses Overview Section */}
        <div className="bg-white shadow-md rounded-lg p-6" style={{ height: '300px', width: '30%' }}>
          <ExpensesOverview />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
