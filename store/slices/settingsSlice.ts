import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  vibration: boolean;
  notifications: boolean;
  theme: 'system' | 'dark' | 'light';
  soundEffects: boolean;
  music: boolean;
  dataCollection: {
    location: boolean;
    batteryLevel: boolean;
    motionData: boolean;
    lightSensor: boolean;
  };
}

const initialState: SettingsState = {
  vibration: true,
  notifications: true,
  theme: 'system',
  soundEffects: true,
  music: true,
  dataCollection: {
    location: true,
    batteryLevel: true,
    motionData: true,
    lightSensor: true,
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleVibration: (state) => {
      state.vibration = !state.vibration;
    },
    toggleNotifications: (state) => {
      state.notifications = !state.notifications;
    },
    setTheme: (state, action: PayloadAction<'system' | 'dark' | 'light'>) => {
      state.theme = action.payload;
    },
    toggleSoundEffects: (state) => {
      state.soundEffects = !state.soundEffects;
    },
    toggleMusic: (state) => {
      state.music = !state.music;
    },
    toggleDataCollection: (state, action: PayloadAction<keyof SettingsState['dataCollection']>) => {
      state.dataCollection[action.payload] = !state.dataCollection[action.payload];
    },
    updateSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  toggleVibration,
  toggleNotifications,
  setTheme,
  toggleSoundEffects,
  toggleMusic,
  toggleDataCollection,
  updateSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;