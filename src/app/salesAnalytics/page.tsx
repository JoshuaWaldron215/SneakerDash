"use client";

import React, { useMemo } from 'react';
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

interface MonthlyData {
  revenue: number;
  profit: number;
}

const SalesAnalytics = () => {
  const inventory = useAppSelector((state) => state.inventory.shoes);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Calculations for overall metrics
  const metrics = useMemo(() => {
    const soldShoes = inventory.filter((shoe) => shoe.dateSold && shoe.priceSold);
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
      averageProfitPerShoe, // New metric for average profit per shoe
    };
  }, [inventory]);

  // Group sales by month
  const chartData = useMemo(() => {
    const monthlyData: Record<string, MonthlyData> = {};

    inventory.forEach((shoe) => {
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
  }, [inventory]);

  return (
    <div className={`max-w-6xl mx-auto p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg`}>
      <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Sales Analytics</h2>

      <div className="flex flex-col lg:flex-row justify-between gap-8">
        {/* Metrics Section */}
        <div className={`flex-1 p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg`}>
          <p className={`text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Number of Shoes Sold: {metrics.numberOfShoesSold}
          </p>
          <p className={`text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Total Sales: ${metrics.totalSales.toFixed(2)}
          </p>
          <p className={`text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Total Profit: ${metrics.totalProfit.toFixed(2)}
          </p>
          <p className={`text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Total Cost: ${metrics.totalCost.toFixed(2)}
          </p>
          <p className={`text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Average Profit per Shoe: ${metrics.averageProfitPerShoe.toFixed(2)} {/* Display Average Profit per Shoe */}
          </p>
          <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            ROI: {metrics.roi.toFixed(2)}%
          </p>
        </div>

        {/* Chart Section */}
        <div className="flex-1 h-[600px] p-4 rounded-lg shadow-lg bg-white">
          <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-800' : 'text-gray-900'}`}>
            Revenue and Profit by Month
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
  );
};

export default SalesAnalytics;
