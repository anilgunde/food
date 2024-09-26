// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { logger } from 'redux-logger';
import { persistReducer, persistStore } from 'redux-persist';
import storageSession from 'redux-persist/lib/storage/session';
import rootReducer from './slices/app.tsx';

const persistConfig = {
    key: 'root',
    storage: storageSession,
  };
  const initialReducers = combineReducers({
    app: rootReducer,
});
  
  const persistedReducer = persistReducer(persistConfig, initialReducers);
  
  const isDevelopment = process.env.NODE_ENV === 'development';

  const loggerMiddleware = isDevelopment ? [logger] : [];
  
  const store = configureStore({
    reducer:persistedReducer, middleware:(getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(loggerMiddleware)
});
  const persistor = persistStore(store);
  
  export { persistor, store };

