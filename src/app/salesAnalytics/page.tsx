"use client";

import React, { useMemo, useState } from 'react';
import { useAppSelector } from '@/app/redux';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, TimeScale);

const SalesAnalytics = () => {
  const inventory = useAppSelector((state) => state.inventory.shoes);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // Get a list of months available in the data
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    inventory.forEach((shoe) => {
      if (shoe.dateSold && shoe.priceSold) {
        const date = new Date(shoe.dateSold);
        const month = `${date.getFullYear()}-${date.getMonth() + 1}`;
        months.add(month);
      }
    });
    return Array.from(months).sort();
  }, [inventory]);

  // Filter data based on selected month
  const filteredInventory = useMemo(() => {
    if (!selectedMonth) return inventory;
    return inventory.filter((shoe) => {
      if (shoe.dateSold && shoe.priceSold) {
        const date = new Date(shoe.dateSold);
        const month = `${date.getFullYear()}-${date.getMonth() + 1}`;
        return month === selectedMonth;
      }
      return false;
    });
  }, [selectedMonth, inventory]);

  // Calculations for metrics based on filtered data
  const metrics = useMemo(() => {
    const soldShoes = filteredInventory.filter((shoe) => shoe.dateSold && shoe.priceSold);
    const totalSales = soldShoes.reduce((acc, shoe) => acc + (shoe.priceSold || 0), 0);
    const totalProfit = soldShoes.reduce((acc, shoe) => acc + ((shoe.priceSold || 0) - shoe.purchasePrice), 0);
    const totalCost = soldShoes.reduce((acc, shoe) => acc + shoe.purchasePrice, 0);
    const roi = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
    const averageProfitPerShoe = soldShoes.length > 0 ? totalProfit / soldShoes.length : 0;

    return {
      numberOfShoesSold: soldShoes.length,
      totalSales,
      totalProfit,
      totalCost,
      roi,
      averageProfitPerShoe,
    };
  }, [filteredInventory]);

  // Prepare chart data based on filtered data
  const chartData = useMemo(() => {
    const monthlyData: Record<string, { revenue: number; profit: number }> = {};

    filteredInventory.forEach((shoe) => {
      if (shoe.dateSold && shoe.priceSold) {
        const date = new Date(shoe.dateSold);
        const month = `${date.getFullYear()}-${date.getMonth() + 1}`;

        if (!monthlyData[month]) {
          monthlyData[month] = { revenue: 0, profit: 0 };
        }

        monthlyData[month].revenue += shoe.priceSold;
        monthlyData[month].profit += shoe.priceSold - shoe.purchasePrice;
      }
    });

    const labels = Object.keys(monthlyData).sort();
    const revenueData = labels.map((label) => monthlyData[label].revenue);
    const profitData = labels.map((label) => monthlyData[label].profit);

    return {
      labels,
      datasets: [
        {
          label: 'Revenue ($)',
          data: revenueData,
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Profit ($)',
          data: profitData,
          backgroundColor: 'rgba(153, 102, 255, 0.7)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        },
      ],
    };
  }, [filteredInventory]);

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-3xl font-bold mb-6">Sales Analytics</h2> 
{/* className="mr-2 text-lg text-3xl font-bold mb-6" */}
      {/* Month Selector */}
      <div className="mb-6">
        <label className="mr-2 text-lg font-bold mb-6">Select Month:</label>
        <select
          value={selectedMonth || ''}
          onChange={(e) => setSelectedMonth(e.target.value || null)}
          className={`p-2 border rounded-lg ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'}`}
        >
          <option value="">All</option>
          {availableMonths.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Metrics Section */}
        <div className="lg:col-span-1">
          <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Key Metrics</h3>
            <div className="space-y-3">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-sm`}>
                <p className="text-lg font-medium">Number of Shoes Sold</p>
                <p className="text-2xl font-bold">{metrics.numberOfShoesSold}</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-sm`}>
                <p className="text-lg font-medium">Total Sales</p>
                <p className="text-2xl font-bold">${metrics.totalSales.toFixed(2)}</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-sm`}>
                <p className="text-lg font-medium">Total Profit</p>
                <p className="text-2xl font-bold">${metrics.totalProfit.toFixed(2)}</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-sm`}>
                <p className="text-lg font-medium">Total Cost</p>
                <p className="text-2xl font-bold">${metrics.totalCost.toFixed(2)}</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-sm`}>
                <p className="text-lg font-medium">Average Profit per Shoe</p>
                <p className="text-2xl font-bold">${metrics.averageProfitPerShoe.toFixed(2)}</p>
              </div>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} shadow-sm`}>
                <p className="text-lg font-medium">Average ROI</p>
                <p className="text-2xl font-bold">{metrics.roi.toFixed(2)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="lg:col-span-2">
          <div className={`h-[616px] p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Revenue and Profit Overview
            </h3>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Revenue and Profit by Month' },
                },
                scales: {
                  x: {
                    type: 'category',
                  },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 100,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;
