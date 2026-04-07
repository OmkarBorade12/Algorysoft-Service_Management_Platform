// Redux store with localStorage persistence
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, createMigrate } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import searchReducer from './slices/searchSlice';
import currencyReducer from './slices/currencySlice';
import reviewReducer from './slices/reviewSlice';
import carouselReducer from './slices/carouselSlice';
import ordersReducer from './slices/ordersSlice';
import productsReducer from './slices/productsSlice';
import categoriesReducer from './slices/categoriesSlice';
import requestsReducer from './slices/requestsSlice';
import invoicesReducer from './slices/invoicesSlice';
import featuresReducer from './slices/featuresSlice';
import pricingCardsReducer from './slices/pricingCardsSlice';
import statsReducer from './slices/statsSlice';

const rootReducer = combineReducers({
  cart: cartReducer,
  wishlist: wishlistReducer,
  auth: authReducer,
  ui: uiReducer,
  search: searchReducer,
  currency: currencyReducer,
  reviews: reviewReducer,
  carousel: carouselReducer,
  orders: ordersReducer,
  products: productsReducer,
  categories: categoriesReducer,
  requests: requestsReducer,
  invoices: invoicesReducer,
  features: featuresReducer,
  pricingCards: pricingCardsReducer,
  stats: statsReducer,
});

// v2 migration: wipe cart to remove stale items that had combined base+tier pricing
// Immediate fix for existing storage quota errors by clearing the old bloated key
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('persist:algorysoft-root');
  } catch (e) {}
}

const migrations: any = {
  2: (state: any) => ({
    ...state,
    cart: undefined, // forces cart reducer to reset to its initialState
  }),
  3: (state: any) => ({
    ...state,
    // Force heavy server data out of storage to fix QuotaExceededError
    products: undefined,
    reviews: undefined,
    orders: undefined,
    requests: undefined,
    invoices: undefined,
    carousel: undefined,
    categories: undefined,
    features: undefined,
    pricingCards: undefined,
    stats: undefined,
  }),
};

const safeStorage = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') return Promise.resolve(null);
    return Promise.resolve(localStorage.getItem(key));
  },
  setItem: (key: string, value: string) => {
    if (typeof window === 'undefined') return Promise.resolve();
    try {
      localStorage.setItem(key, value);
      return Promise.resolve();
    } catch (e) {
      try {
        localStorage.clear();
        localStorage.setItem(key, value);
        return Promise.resolve();
      } catch (e2) {
        console.error('Storage full even after clear');
        return Promise.resolve();
      }
    }
  },
  removeItem: (key: string) => {
    if (typeof window === 'undefined') return Promise.resolve();
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};

const persistConfig = {
  key: 'algorysoft-root-final',
  version: 3,
  storage: safeStorage,
  migrate: createMigrate(migrations, { debug: false }),
  whitelist: ['cart', 'auth', 'currency'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
