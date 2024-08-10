"use client";

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { Shoe, addShoe, deleteShoe } from '@/app/state/inventorySlice';

const Inventory = () => {
  const [sku, setSku] = useState('');
  const [dateBought, setDateBought] = useState('');
  const [shoeName, setShoeName] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');

  const dispatch = useAppDispatch();
  const inventory = useAppSelector((state) => state.inventory.shoes);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const handleAddShoe = () => {
    dispatch(addShoe({ 
        dateBought, sku, 
      shoeName, 
      purchasePrice: Number(purchasePrice)  
    }));
    // Clear form
    setDateBought('');
    setSku('');
    setShoeName('');
    setPurchasePrice('');
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg`}>
      <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Inventory</h2>
      <div className="space-y-4">
      <input
          type="date"
          value={dateBought}
          onChange={(e) => setDateBought(e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
        />
        <input
          type="text"
          placeholder="SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
        />
        
        <input
          type="text"
          placeholder="Shoe Name"
          value={shoeName}
          onChange={(e) => setShoeName(e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
        />
        <input
          type="number"
          placeholder="Purchase Price"
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
        />
        <button
          onClick={handleAddShoe}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Shoe
        </button>
      </div>

      <div className="mt-8">
        <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Your Inventory</h3>
        <ul className="space-y-2">
          {inventory.map((shoe: Shoe, index: number) => (
            <li
              key={index}
              className={`flex justify-between items-center p-4 rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
            >
              <span>
                {shoe.sku} - {shoe.shoeName} - ${shoe.purchasePrice} - Bought on {shoe.dateBought}
              </span>
              <button
                onClick={() => dispatch(deleteShoe(index))}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Inventory;
