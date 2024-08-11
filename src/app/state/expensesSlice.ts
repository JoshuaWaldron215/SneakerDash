// src/app/state/expensesSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
}

interface ExpensesState {
  items: Expense[];
}

const initialState: ExpensesState = {
  items: [],
};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action: PayloadAction<Omit<Expense, 'id'>>) => {
      const newExpense = {
        id: new Date().toISOString(),
        ...action.payload,
      };
      state.items.push(newExpense);
    },
    deleteExpense: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((expense) => expense.id !== action.payload);
    },
  },
});

export const { addExpense, deleteExpense } = expensesSlice.actions;

export default expensesSlice.reducer;
