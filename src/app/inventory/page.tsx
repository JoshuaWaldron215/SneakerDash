"use client";

import React, { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { Shoe, addShoe, deleteShoe } from '@/app/state/inventorySlice';

const Inventory = () => {
  const [sku, setSku] = useState('');
  const [dateBought, setDateBought] = useState('');
  const [shoeName, setShoeName] = useState('');
  const [size, setSize] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [dateSold, setDateSold] = useState('');  // New state for Date Sold
  const [priceSold, setPriceSold] = useState('');  // New state for Price Sold

  const dispatch = useAppDispatch();
  const inventory = useAppSelector((state) => state.inventory.shoes);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const handleAddShoe = () => {
    dispatch(addShoe({ 
      dateBought, 
      sku, 
      shoeName, 
      size: Number(size),
      purchasePrice: Number(purchasePrice),
      dateSold, // Include Date Sold
      priceSold: priceSold ? Number(priceSold) : undefined, // Include Price Sold
    }));
    // Clear form
    setDateBought('');
    setSku('');
    setShoeName('');
    setSize('');
    setPurchasePrice('');
    setDateSold('');  // Clear Date Sold
    setPriceSold('');  // Clear Price Sold
  };

  // Grouping inventory items by month and year
  const groupedInventory = useMemo(() => {
    return inventory.reduce((groups, shoe) => {
      const date = new Date(shoe.dateBought);
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });

      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }

      groups[monthYear].push(shoe);
      return groups;
    }, {} as Record<string, Shoe[]>);
  }, [inventory]);

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
          placeholder="Size"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
        />

        <input
          type="number"
          placeholder="Purchase Price"
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
        />

        {/* New Date Sold Input */}
        <input
          type="date"
          value={dateSold}
          onChange={(e) => setDateSold(e.target.value)}
          placeholder="Date Sold"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
        />

        {/* New Price Sold Input */}
        <input
          type="number"
          placeholder="Price Sold"
          value={priceSold}
          onChange={(e) => setPriceSold(e.target.value)}
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
        {Object.keys(groupedInventory).length > 0 ? (
          Object.keys(groupedInventory).map((monthYear) => (
            <div key={monthYear} className="mb-8">
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {monthYear}
              </h3>
              <ul className="space-y-2">
                {groupedInventory[monthYear].map((shoe, index) => (
                  <li
                    key={index}
                    className={`flex justify-between items-center p-4 rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                  >
                    <span>
                      {shoe.sku} - {shoe.shoeName} - Size: {shoe.size} - ${shoe.purchasePrice} - Bought on {shoe.dateBought}
                      {shoe.dateSold && shoe.priceSold ? (
                        <> - Sold on {shoe.dateSold} for ${shoe.priceSold}</>
                      ) : null}
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
          ))
        ) : (
          <p className="text-gray-500">No inventory items found.</p>
        )}
      </div>
    </div>
  );
};

export default Inventory;

