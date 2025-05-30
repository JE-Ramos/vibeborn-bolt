import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Creature } from '@/types/creature';

interface SummonState {
  creatures: Creature[];
  summonCount: number;
  lastSummonDate: string | null;
}

const initialState: SummonState = {
  creatures: [],
  summonCount: 0,
  lastSummonDate: null,
};

const summonSlice = createSlice({
  name: 'summons',
  initialState,
  reducers: {
    addSummon: (state, action: PayloadAction<Creature>) => {
      state.creatures.push(action.payload);
      state.summonCount += 1;
      state.lastSummonDate = new Date().toISOString();
    },
    removeSummon: (state, action: PayloadAction<string>) => {
      state.creatures = state.creatures.filter(creature => creature.id !== action.payload);
    },
    clearAllSummons: (state) => {
      state.creatures = [];
    },
    updateSummon: (state, action: PayloadAction<{ id: string, updates: Partial<Creature> }>) => {
      const { id, updates } = action.payload;
      const index = state.creatures.findIndex(creature => creature.id === id);
      if (index !== -1) {
        state.creatures[index] = { ...state.creatures[index], ...updates };
      }
    },
  },
});

export const { addSummon, removeSummon, clearAllSummons, updateSummon } = summonSlice.actions;
export default summonSlice.reducer;