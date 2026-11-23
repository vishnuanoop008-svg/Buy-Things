import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/users';

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const email = userData.email.trim().toLowerCase();

      const existingUsers = await axios.get(API_URL, {
        params: { email },
      });

      if (existingUsers.data.length > 0) {
        return rejectWithValue('Email already registered.');
      }

      const response = await axios.post(API_URL, {
        ...userData,
        email,
      });

      const { password, ...safeUser } = response.data;
      return safeUser;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed.'
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL, {
        params: { email: email.trim().toLowerCase() },
      });

      const user = response.data.find(item => item.password === password);

      if (!user) {
        return rejectWithValue('Invalid email or password.');
      }

      const { password: savedPassword, ...safeUser } = user;
      return safeUser;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed.'
      );
    }
  }
);

const getSavedUser = () => {
  try {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getSavedUser(),
    loading: false,
    error: null,
    authModalOpen: false,
    authModalMode: 'login',
  },
  reducers: {
    logout: state => {
      state.user = null;
      state.error = null;
      localStorage.removeItem('user');
    },
    openAuthModal: (state, action) => {
      state.authModalOpen = true;
      state.authModalMode = action.payload || 'login';
      state.error = null;
    },
    closeAuthModal: state => {
      state.authModalOpen = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed.';
      })
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed.';
      });
  },
});

export const {
  logout,
  openAuthModal,
  closeAuthModal,
} = authSlice.actions;

export default authSlice.reducer;