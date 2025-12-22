/**
 * User API - RTK Query
 * 
 * RTK Query API slice for user-related operations.
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base URL for API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * User API slice
 */
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/users`,
    prepareHeaders: (headers) => {
      // Get token from localStorage
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) {
          headers.set('authorization', `Bearer ${token}`);
        }
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    /**
     * Get current user profile
     * GET /users/me
     */
    getMe: builder.query({
      query: () => '/me',
      providesTags: ['User'],
    }),

    /**
     * Update user profile
     * PATCH /users/me
     */
    updateProfile: builder.mutation({
      query: (data) => ({
        url: '/me',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
      // Update the user in localStorage and potentially state
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            if (typeof window !== 'undefined') {
              localStorage.setItem('user', JSON.stringify(data.data));
            }
          }
        } catch {
          // Error handling is done by the component
        }
      },
    }),
  }),
});

// Export hooks
export const {
  useGetMeQuery,
  useUpdateProfileMutation,
} = userApi;
