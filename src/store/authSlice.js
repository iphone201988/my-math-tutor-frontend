/**
 * Auth Slice - Redux Toolkit
 * 
 * Manages authentication state including user info and auth status.
 */

import { createSlice } from '@reduxjs/toolkit';
import { authApi } from './authApi';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

/**
 * Auth slice
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set user from localStorage on app load
    initializeAuth: (state) => {
      if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('accessToken');
        
        if (userStr && token) {
          try {
            state.user = JSON.parse(userStr);
            state.isAuthenticated = true;
          } catch {
            state.user = null;
            state.isAuthenticated = false;
          }
        }
      }
      state.isLoading = false;
    },
    
    // Logout
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    },
    
    // Set user
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle successful signin
    builder.addMatcher(
      authApi.endpoints.signin.matchFulfilled,
      (state, { payload }) => {
        if (payload.success && payload.data?.user) {
          state.user = payload.data.user;
          state.isAuthenticated = true;
        }
      }
    );
  },
});

export const { initializeAuth, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
