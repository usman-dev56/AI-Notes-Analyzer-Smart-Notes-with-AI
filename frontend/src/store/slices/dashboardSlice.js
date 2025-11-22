import { createSlice } from '@reduxjs/toolkit';
import { mockDashboardStats } from '../../data/mockData';

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: mockDashboardStats,
    loading: false,
    error: null
  },
  reducers: {
    getDashboardStats: (state) => {
      // In static version, we just use mock data
      state.stats = mockDashboardStats;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { getDashboardStats, setLoading, setError } = dashboardSlice.actions;
export default dashboardSlice.reducer;