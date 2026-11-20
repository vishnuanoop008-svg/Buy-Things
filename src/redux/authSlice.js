
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/users';

// Register user
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const check = await axios.get(
        `${API_URL}?email=${encodeURIComponent(userData.email)}`
      );

      if (check.data.length > 0) {
        return rejectWithValue('Email already registered!');
      }

      const response = await axios.post(API_URL, userData);

      const { password, ...safeUser } = response.data;
      return safeUser;

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Login user
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}?email=${encodeURIComponent(email)}`
      );

      const user = response.data.find(
        item => item.password === password
      );

      if (!user) {
        return rejectWithValue('Invalid email or password!');
      }

      const { password: savedPassword, ...safeUser } = user;
      return safeUser;

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get saved user
const savedUser = localStorage.getItem('user');

const authSlice = createSlice({
  name: 'auth',

  initialState: {
    user: savedUser ? JSON.parse(savedUser) : null,
    loading: false,
    error: null,

    authModalOpen: false,
    authModalMode: 'login'
  },

  reducers: {

    // Logout
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },

    // Open login/register modal
    openAuthModal: (state, action) => {
      state.authModalOpen = true;
      state.authModalMode = action.payload || 'login';
    },

    // Close modal
    closeAuthModal: (state) => {
      state.authModalOpen = false;
    }

  },

  extraReducers: (builder) => {
    builder

      // Register pending
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // Register successful
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })

      // Register failed
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login pending
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // Login successful
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })

      // Login failed
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Export actions
export const {
  logout,
  openAuthModal,
  closeAuthModal
} = authSlice.actions;

export default authSlice.reducer;
