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
  const [dateSold, setDateSold] = useState('');
  const [priceSold, setPriceSold] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(''); // State for filtering by month

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
      dateSold,
      priceSold: priceSold ? Number(priceSold) : undefined,
    }));
    setDateBought('');
    setSku('');
    setShoeName('');
    setSize('');
    setPurchasePrice('');
    setDateSold('');
    setPriceSold('');
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

  // Filter inventory based on the selected month
  const filteredInventory = useMemo(() => {
    if (!selectedMonth) return inventory;
    return groupedInventory[selectedMonth] || [];
  }, [selectedMonth, groupedInventory, inventory]);

  // List of available months for filtering
  const availableMonths = useMemo(() => {
    return Object.keys(groupedInventory).sort();
  }, [groupedInventory]);

  return (
    <div className={`max-w-6xl mx-auto p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg rounded-lg`}>
      <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Inventory Management</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            value={dateBought}
            onChange={(e) => setDateBought(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
          />

          <input
            type="text"
            placeholder="SKU"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
          />
          
          <input
            type="text"
            placeholder="Shoe Name"
            value={shoeName}
            onChange={(e) => setShoeName(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
          />

          <input
            type="number"
            placeholder="Size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
          />

          <input
            type="number"
            placeholder="Purchase Price"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
          />

          <input
            type="date"
            value={dateSold}
            onChange={(e) => setDateSold(e.target.value)}
            placeholder="Date Sold"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
          />

          <input
            type="number"
            placeholder="Price Sold"
            value={priceSold}
            onChange={(e) => setPriceSold(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
          />
        </div>

        <button
          onClick={handleAddShoe}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
        >
          Add Shoe
        </button>
      </div>

      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Your Inventory</h3>
          <div className="flex items-center">
            <label htmlFor="monthFilter" className={`mr-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Filter by Month:</label>
            <select
              id="monthFilter"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
            >
              <option value="">All</option>
              {availableMonths.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-6 rounded-lg shadow-md max-h-[400px] overflow-y-auto bg-gray-50">
          {filteredInventory.length > 0 ? (
            filteredInventory.map((shoe, index) => (
              <div key={index} className={`mb-4 p-4 rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                <div className="flex justify-between items-center">
                  <span>
                    <strong>{shoe.sku}</strong> - {shoe.shoeName} - Size: {shoe.size} - ${shoe.purchasePrice} - Bought on {shoe.dateBought}
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
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No inventory items found for this month.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;

