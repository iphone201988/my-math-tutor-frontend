/**
 * Redux Store Configuration
 * 
 * Configures the Redux store with RTK Query and auth slice.
 */

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './authApi';
import authReducer from './authSlice';

/**
 * Create and configure the Redux store
 */
export const store = configureStore({
  reducer: {
    // Auth state
    auth: authReducer,

    // RTK Query API
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export default store;
