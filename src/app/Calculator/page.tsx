"use client";

import React, { useState } from "react";
import { useAppSelector } from '@/app/redux';

const CalculatorPage = () => {
  const [cost, setCost] = useState("");
  const [revenue, setRevenue] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [roi, setRoi] = useState<number | null>(null);
  const [profit, setProfit] = useState<number | null>(null);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Handle ROI Calculation
  const calculateRoi = () => {
    if (cost && revenue) {
      const roiValue = ((Number(revenue) - Number(cost)) / Number(cost)) * 100;
      setRoi(roiValue);
    }
  };

  // Handle Profit Calculation
  const calculateProfit = () => {
    if (cost && sellingPrice) {
      const profitValue = Number(sellingPrice) - Number(cost);
      setProfit(profitValue);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold mb-6">Product Calculators</h2>

      {/* ROI Calculator */}
      <div className={`shadow-md rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-xl font-semibold mb-4 text-black">ROI Calculator</h3>
        <div className="space-y-4">
          <input
            type="number"
            placeholder="Buy Cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              isDarkMode ? 'bg-gray-700 border-gray-600 text-black focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
            }`}
          />
          <input
            type="number"
            placeholder="Revenue"
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              isDarkMode ? 'bg-gray-700 border-gray-600 text-black focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
            }`}
          />
          <button
            onClick={calculateRoi}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Calculate ROI
          </button>
          {roi !== null && (
            <div className="mt-4 text-black">
              <p className="text-lg">ROI: {roi.toFixed(2)}%</p>
            </div>
          )}
        </div>
      </div>

      {/* Profit Calculator */}
      <div className={`shadow-md rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className="text-xl font-semibold mb-4 text-black">Profit Calculator</h3>
        <div className="space-y-4">
          <input
            type="number"
            placeholder="Buy Cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              isDarkMode ? 'bg-gray-700 border-gray-600 text-black focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
            }`}
          />
          <input
            type="number"
            placeholder="Selling Price"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              isDarkMode ? 'bg-gray-700 border-gray-600 text-black focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
            }`}
          />
          <button
            onClick={calculateProfit}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Calculate Profit
          </button>
          {profit !== null && (
            <div className="mt-4 text-black">
              <p className="text-lg">Profit: ${profit.toFixed(2)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;
