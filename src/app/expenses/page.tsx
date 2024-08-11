"use client";

import React, { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { addExpense, deleteExpense } from '@/app/state/expensesSlice';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const Expenses = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  const dispatch = useAppDispatch();
  const expenses = useAppSelector((state) => state.expenses.items);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const handleAddExpense = () => {
    dispatch(addExpense({ description, amount: Number(amount), date }));
    setDescription('');
    setAmount('');
    setDate('');
  };

  const handleDeleteExpense = (id: string) => {
    dispatch(deleteExpense(id));
  };

  // Group expenses by month
  const expensesByMonth = useMemo(() => {
    const grouped: Record<string, typeof expenses> = {};

    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      const month = date.toLocaleString('default', { year: 'numeric', month: 'long' });

      if (!grouped[month]) {
        grouped[month] = [];
      }

      grouped[month].push(expense);
    });

    return grouped;
  }, [expenses]);

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
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold mb-6">Expenses</h2>

      <div className="space-y-4">
        <select
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
          }`}
        >
          <option value="Office Supplies">Office Supplies</option>
          <option value="Gas">Gas</option>
          <option value="Shipping Fees">Shipping Fees</option>
          <option value="Subscriptions">Subscriptions</option>
          <option value="Education">Education</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
          }`}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
          }`}
        />
        <button
          onClick={handleAddExpense}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Expense
        </button>
      </div>

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

      <div className="bg-white shadow-md rounded-lg p-6 mt-8">
        <h3 className="text-xl font-semibold mb-4">Expense List</h3>
        {Object.entries(expensesByMonth).map(([month, monthlyExpenses]) => (
          <div key={month} className="mb-6">
            <h4 className="text-lg font-semibold mb-2">{month}</h4>
            <ul>
              {monthlyExpenses.map((expense) => (
                <li key={expense.id} className="flex justify-between p-4 rounded-lg shadow-sm bg-gray-100 text-gray-900 mb-2">
                  <span>{expense.date} - {expense.description} - ${expense.amount.toFixed(2)}</span>
                  <button
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Expenses;
