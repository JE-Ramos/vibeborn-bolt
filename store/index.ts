import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import summonReducer from './slices/summonSlice';
import storeReducer from './slices/storeSlice';
import settingsReducer from './slices/settingsSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['summons', 'store', 'settings'], // Only persist these reducers
};

const rootReducer = combineReducers({
  summons: summonReducer,
  store: storeReducer,
  settings: settingsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;