import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notesService } from '../../services/notesService';

export const getDashboardStats = createAsyncThunk(
  'dashboard/getStats',
  async (_, thunkAPI) => {
    try {
      const response = await notesService.getDashboardStats();
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Failed to load dashboard statistics. Please try again.';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const getAIStatus = createAsyncThunk(
  'dashboard/getAIStatus',
  async (_, thunkAPI) => {
    try {
      const response = await notesService.getAIStatus();
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                          'AI service status check failed';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: {
      totalNotes: 0,
      categoryCount: { Study: 0, Work: 0, Personal: 0 },
      analyzedNotes: 0,
      recentNotes: 0,
      commonTone: 'N/A',
      topKeywords: []
    },
    loading: false,
    error: null,
    aiStatus: null,
    aiStatusLoading: false
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearLoading: (state) => {
      state.loading = false;
    },
    resetStats: (state) => {
      state.stats = {
        totalNotes: 0,
        categoryCount: { Study: 0, Work: 0, Personal: 0 },
        analyzedNotes: 0,
        recentNotes: 0,
        commonTone: 'N/A',
        topKeywords: []
      };
    },
    clearAIStatus: (state) => {
      state.aiStatus = null;
    },
    clearAIStatusLoading: (state) => {
      state.aiStatusLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Stats
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Reset stats on error to prevent showing stale data
        state.stats = {
          totalNotes: 0,
          categoryCount: { Study: 0, Work: 0, Personal: 0 },
          analyzedNotes: 0,
          recentNotes: 0,
          commonTone: 'N/A',
          topKeywords: []
        };
      })
      
      // AI Status
      .addCase(getAIStatus.pending, (state) => {
        state.aiStatusLoading = true;
      })
      .addCase(getAIStatus.fulfilled, (state, action) => {
        state.aiStatusLoading = false;
        state.aiStatus = action.payload.data;
      })
      .addCase(getAIStatus.rejected, (state, action) => {
        state.aiStatusLoading = false;
        state.aiStatus = { 
          status: 'unavailable', 
          error: action.payload,
          lastChecked: new Date().toISOString()
        };
      });
  }
});

export const { 
  clearError, 
  clearLoading, 
  resetStats, 
  clearAIStatus, 
  clearAIStatusLoading 
} = dashboardSlice.actions;

export default dashboardSlice.reducer;