"use client";

import React from 'react';
import { useAppSelector } from '@/app/redux';
import { Shoe } from '@/app/state/inventorySlice';

const Dashboard = () => {
  
  const inventory = useAppSelector((state) => state.inventory.shoes);

  return (
    
    <div className="max-w-6xl p-6 bg-white shadow-md rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Your Inventory</h3>
      <div className="flex flex-col items-start ml-4">
        {inventory.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {inventory.map((shoe: Shoe, index: number) => (
              <div
                key={index}
                className="p-4 w-59 bg-gray-100 rounded-lg shadow-sm"
              >
                <div className="font-semibold text-lg mb-2">{shoe.shoeName}</div>
                <div className="text-sm text-gray-600">SKU: {shoe.sku}</div>
                <div className="text-sm text-gray-600">Price: ${shoe.purchasePrice}</div>
                <div className="text-sm text-gray-600">Date Bought: {shoe.dateBought}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No inventory items found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

