import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import lawReducer from './lawSlice';
import uiReducer from './uiSlice';
import userReducer from './userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    law: lawReducer,
    ui: uiReducer,
    user: userReducer,
  },
  devTools: import.meta.env.NODE_ENV !== 'production',
});

export default store;
