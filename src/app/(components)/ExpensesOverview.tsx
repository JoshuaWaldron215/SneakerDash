// src/app/components/ExpensesOverview.tsx

import React, { useMemo } from 'react';
import { useAppSelector } from '@/app/redux';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ExpensesOverview = () => {
  const expenses = useAppSelector((state) => state.expenses.items);

  const chartData = useMemo(() => {
    const categoryData: Record<string, number> = {};

    expenses.forEach((expense) => {
      const category = expense.description;

      if (!categoryData[category]) {
        categoryData[category] = 0;
      }

      categoryData[category] += expense.amount;
    });

    const labels = Object.keys(categoryData);
    const amountData = labels.map((label) => categoryData[label]);

    return {
      labels,
      datasets: [
        {
          label: 'Expenses ($)',
          data: amountData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [expenses]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Expenses Overview</h3>
      <Pie
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Expenses by Category' },
          },
        }}
      />
    </div>
  );
};

export default ExpensesOverview;
