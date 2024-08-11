import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Shoe {
    sku: string;
    dateBought: string;
    shoeName: string;
    purchasePrice: number;
    size: number; 
    dateSold?: string; // Optional field
    priceSold?: number; // Optional field
  }

interface InventoryState {
  shoes: Shoe[];
}

const initialState: InventoryState = {
  shoes: [],
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    addShoe: (state, action: PayloadAction<Shoe>) => {
      state.shoes.push(action.payload);
    },
    deleteShoe: (state, action: PayloadAction<number>) => {
      state.shoes.splice(action.payload, 1);
    },
  },
});

export const { addShoe, deleteShoe } = inventorySlice.actions;

export default inventorySlice.reducer;
