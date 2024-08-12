"use client";

import React, { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { addExpense, deleteExpense } from '@/app/state/expensesSlice';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const Expenses = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');  // New state for selected month

  const dispatch = useAppDispatch();
  const expenses = useAppSelector((state) => state.expenses.items);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const handleAddExpense = () => {
    if (description && amount && date) {
      dispatch(addExpense({ description, amount: Number(amount), date }));
      setDescription('');
      setAmount('');
      setDate('');
    }
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

  // Calculate total expenses for the selected month
  const totalExpenses = useMemo(() => {
    if (!selectedMonth) return expenses.reduce((total, expense) => total + expense.amount, 0);

    const selectedMonthExpenses = expensesByMonth[selectedMonth] || [];
    return selectedMonthExpenses.reduce((total, expense) => total + expense.amount, 0);
  }, [selectedMonth, expenses, expensesByMonth]);

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
    <div className={`max-w-7xl mx-auto p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg rounded-lg`}>
      <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Expenses Management</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expense Form Section */}
        <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Add New Expense</h3>
          <div className="space-y-4">
            <select
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
              }`}
            >
              <option value="" disabled>Select Category</option>
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
        </div>

        {/* Total Expenses Section */}
        <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Total Expenses</h3>
          <div className="flex items-center mb-4">
            <label htmlFor="monthFilter" className={`mr-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Filter by Month:
            </label>
            <select
              id="monthFilter"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
              }`}
            >
              <option value="">All</option>
              {Object.keys(expensesByMonth).map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
          <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            ${totalExpenses.toFixed(2)}
          </p>
        </div>

        {/* Chart Section */}
        <div className={`lg:col-span-2 p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Expenses Overview</h3>
          <div className="h-[400px]">
            <Pie
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Expenses by Category' },
                },
              }}
            />
          </div>
        </div>

        {/* Expense List Section */}
        <div className={`lg:col-span-1 p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Expense List</h3>
          <div className="space-y-4 overflow-y-auto" style={{ maxHeight: '400px' }}>
            {Object.entries(expensesByMonth).map(([month, monthlyExpenses]) => (
              <div key={month} className="mb-6">
                <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{month}</h4>
                <ul className="space-y-2">
                  {monthlyExpenses.map((expense) => (
                    <li key={expense.id} className={`flex justify-between p-4 rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}>
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
      </div>
    </div>
  );
};

export default Expenses;


