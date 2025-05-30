import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StoreState {
  currency: number;
  purchasedItems: string[];
  activeItems: string[];
  subscriptionEndDate: string | null;
}

const initialState: StoreState = {
  currency: 1000, // Start with some currency for testing
  purchasedItems: [],
  activeItems: [],
  subscriptionEndDate: null,
};

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    addCurrency: (state, action: PayloadAction<number>) => {
      state.currency += action.payload;
    },
    purchaseItem: (state, action: PayloadAction<string>) => {
      // Normally we would get price from a lookup, but for this example
      // we'll assume the purchase was validated and just add the item
      state.purchasedItems.push(action.payload);
      
      // Mock item price deduction
      if (action.payload === 'ritual-boost') {
        state.currency -= 250;
      } else if (action.payload === 'ritual-sigil') {
        state.currency -= 500;
      } else if (action.payload === 'subscription-monthly') {
        state.currency -= 999;
        // Set subscription end date to 30 days from now
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);
        state.subscriptionEndDate = endDate.toISOString();
      } else if (action.payload === 'cosmetic-particles') {
        state.currency -= 350;
      } else if (action.payload === 'cosmetic-aura') {
        state.currency -= 450;
      }
    },
    activateItem: (state, action: PayloadAction<string>) => {
      if (state.purchasedItems.includes(action.payload) && !state.activeItems.includes(action.payload)) {
        state.activeItems.push(action.payload);
      }
    },
    deactivateItem: (state, action: PayloadAction<string>) => {
      state.activeItems = state.activeItems.filter(item => item !== action.payload);
    },
  },
});

export const { addCurrency, purchaseItem, activateItem, deactivateItem } = storeSlice.actions;
export default storeSlice.reducer;