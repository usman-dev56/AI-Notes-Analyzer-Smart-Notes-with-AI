import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';

// Async thunks
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await authService.register(userData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Registration failed. Please try again.';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await authService.login(email, password);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Login failed. Please check your credentials.';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, thunkAPI) => {
    try {
      const response = await authService.getMe();
      return response.data.user;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Failed to load user data';
      
      // Clear invalid token
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
      authService.logout();
    },
    clearError: (state) => {
      state.error = null;
    },
    clearLoading: (state) => {
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      
      // Get Me
      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
        state.error = action.payload;
      });
  }
});

export const { logout, clearError, clearLoading } = authSlice.actions;
export default authSlice.reducer;