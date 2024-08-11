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

const RevenueProfitChart = () => {
  const inventory = useAppSelector((state) => state.inventory.shoes);

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
    <div className="h-[400px] p-4 rounded-lg shadow-lg bg-white">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">
        
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
  );
};

export default RevenueProfitChart;
