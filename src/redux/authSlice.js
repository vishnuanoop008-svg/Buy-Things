import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/users';

const removePassword = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const email = userData.email.trim().toLowerCase();

      const { data: existingUsers } = await axios.get(API_URL, {
        params: { email },
      });

      const emailExists = existingUsers.some(
        (user) => user.email?.trim().toLowerCase() === email
      );

      if (emailExists) {
        return rejectWithValue('Email already registered.');
      }

      const response = await axios.post(API_URL, {
        ...userData,
        email,
        role: 'customer',
        blocked: false,
      });

      return removePassword(response.data);
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
      const normalizedEmail = email.trim().toLowerCase();

      const { data: users } = await axios.get(API_URL, {
        params: { email: normalizedEmail },
      });

      const user = users.find(
        (item) => item.email?.trim().toLowerCase() === normalizedEmail
      );

      if (!user || user.password !== password) {
        return rejectWithValue('Invalid email or password.');
      }

      if (user.role !== 'admin' && user.blocked === true) {
        return rejectWithValue(
          'This account has been blocked. Please contact support.'
        );
      }

      return removePassword(user);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed.');
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
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem('user');
    },

    updateUserProfile: (state, action) => {
      if (!state.user) return;

      const { password, ...safeUpdates } = action.payload;
      state.user = { ...state.user, ...safeUpdates };
      localStorage.setItem('user', JSON.stringify(state.user));
    },

    openAuthModal: (state, action) => {
      state.authModalOpen = true;
      state.authModalMode = action.payload || 'login';
      state.error = null;
    },

    closeAuthModal: (state) => {
      state.authModalOpen = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
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
      .addCase(loginUser.pending, (state) => {
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

        if (
          typeof action.payload === 'string' &&
          action.payload.toLowerCase().includes('blocked')
        ) {
          state.user = null;
          localStorage.removeItem('user');
        }
      });
  },
});

export const {
  logout,
  updateUserProfile,
  openAuthModal,
  closeAuthModal,
} = authSlice.actions;

export default authSlice.reducer;