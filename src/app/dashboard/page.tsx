"use client";

import React, { useMemo, useState } from 'react';
import { useAppSelector } from '@/app/redux';
import { Shoe } from '@/app/state/inventorySlice';
import RevenueProfitChart from '@/app/(components)/RevenueProfitChart';
import ExpensesOverview from '@/app/(components)/ExpensesOverview';

const Dashboard = () => {
  const inventory = useAppSelector((state) => state.inventory.shoes);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode); // Check if dark mode is enabled
  const [selectedMonth, setSelectedMonth] = useState(''); // State for filtering by month

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
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <h2 className="text-3xl font-bold mb-8">Dashboard Overview</h2>

      {/* Inventory Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold">Your Inventory</h3>
          <div className="flex items-center">
            <label htmlFor="monthFilter" className={`mr-2 ${isDarkMode ? 'text-white-300' : 'text-gray-900'}`}>
              Filter by Month:
            </label>
            <select
              id="monthFilter"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
              }`}
            >
              <option value="">All</option>
              {availableMonths.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto whitespace-nowrap p-2">
          {filteredInventory.length > 0 ? (
            <div className="flex space-x-4">
              {filteredInventory.map((shoe: Shoe, index: number) => (
                <div
                  key={index}
                  className="inline-block p-4 bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="font-semibold text-lg mb-2">{shoe.shoeName}</div>
                  <div className="text-sm text-gray-600">SKU: {shoe.sku}</div>
                  <div className="text-sm text-gray-600">Price: ${shoe.purchasePrice}</div>
                  <div className="text-sm text-gray-600">Date Bought: {shoe.dateBought}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No inventory items found for this month.</p>
          )}
        </div>
      </div>

      {/* Revenue and Expenses Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue and Profit Chart Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 lg:col-span-2">
          <h3 className="text-2xl font-semibold mb-4">Revenue and Profit Overview</h3>
          <div className="w-full h-[400px]">
            <RevenueProfitChart />
          </div>
        </div>

        {/* Expenses Overview Section */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-2xl font-semibold mb-4">Expenses Overview</h3>
          <div className="w-full h-full">
            <ExpensesOverview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


