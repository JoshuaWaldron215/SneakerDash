"use client";

import React, { useState } from "react";
import { useAppSelector } from '@/app/redux';

const CalculatorPage = () => {
  // Separate state variables for each calculator
  const [roiCost, setRoiCost] = useState("");
  const [roiRevenue, setRoiRevenue] = useState("");
  const [profitCost, setProfitCost] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [roi, setRoi] = useState<number | null>(null);
  const [profit, setProfit] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Handle ROI Calculation
  const calculateRoi = () => {
    if (!roiCost || !roiRevenue) {
      setError("Please enter both Buy Cost and Revenue.");
      setRoi(null);  // Clear previous ROI value
      return;
    }

    const cost = Number(roiCost);
    const revenue = Number(roiRevenue);
    const profit = revenue - cost;
    const roiValue = (profit / cost) * 100;
    setRoi(roiValue);
    setError(null);  // Clear error if calculation is successful
  };

  // Handle Profit Calculation
  const calculateProfit = () => {
    if (profitCost && sellingPrice) {
      const profitValue = Number(sellingPrice) - Number(profitCost);
      setProfit(profitValue);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Product Calculators</h2>
      
      <div className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">

        {/* Profit Calculator - Placed on the left */}
        <div className={`shadow-md rounded-lg p-6 flex-1 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'bg-white-700 text-white' : 'bg-white-100 text-gray-900'}`}>Profit Calculator</h3>
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Buy Cost"
              value={profitCost}
              onChange={(e) => setProfitCost(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
              }`}
            />
            <input
              type="number"
              placeholder="Selling Price"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
              }`}
            />
            <button
              onClick={calculateProfit}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Calculate Profit
            </button>
            {profit !== null && (
              <div className={`mt-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                <p className={`text-xl font-semibold mb-4 ${isDarkMode ? 'bg-white-700 text-white' : 'bg-white-100 text-gray-900'}`}>Profit: ${profit.toFixed(2)}</p>
              </div>
            )}
          </div>
        </div>

        {/* ROI Calculator - Placed on the right */}
        <div className={`shadow-md rounded-lg p-6 flex-1 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'bg-white-700 text-white' : 'bg-white-100 text-gray-900'}`}>ROI Calculator</h3>
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Buy Cost"
              value={roiCost}
              onChange={(e) => setRoiCost(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
              }`}
            />
            <input
              type="number"
              placeholder="Revenue"
              value={roiRevenue}
              onChange={(e) => setRoiRevenue(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
              }`}
            />
            <button
              onClick={calculateRoi}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Calculate ROI
            </button>
            {error && (
              <div className="mt-4 text-red-500">
                <p>{error}</p>
              </div>
            )}
            {roi !== null && (
              <div className={`mt-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                <p className={`text-xl font-semibold mb-4 ${isDarkMode ? 'bg-white-700 text-white' : 'bg-white-100 text-gray-900'}`}>ROI: {roi.toFixed(2)}%</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CalculatorPage;

