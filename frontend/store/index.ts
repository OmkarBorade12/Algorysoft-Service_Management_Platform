// Redux store with localStorage persistence
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
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
});

const persistConfig = {
  key: 'algorysoft-root',
  storage,
  whitelist: ['cart', 'wishlist', 'auth', 'currency', 'carousel', 'reviews', 'orders', 'products', 'categories', 'requests', 'invoices', 'features'],
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
