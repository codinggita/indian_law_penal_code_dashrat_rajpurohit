import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import lawReducer from './lawSlice';
import uiReducer from './uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    law: lawReducer,
    ui: uiReducer,
  },
  devTools: import.meta.env.NODE_ENV !== 'production',
});

export default store;
