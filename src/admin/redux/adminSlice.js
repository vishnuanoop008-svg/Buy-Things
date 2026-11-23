import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginAdminRequest } from '../services/adminApi';

const getSavedAdmin = () => {
  try {
    const savedAdmin = localStorage.getItem('adminUser');
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  } catch {
    localStorage.removeItem('adminUser');
    return null;
  }
};

export const loginAdmin = createAsyncThunk(
  'admin/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const users = await loginAdminRequest(email);
      const admin = users.find(
        user => user.password === password && user.role === 'admin'
      );

      if (!admin) {
        return rejectWithValue('Invalid admin email or password.');
      }

      const { password: ignoredPassword, ...safeAdmin } = admin;
      return safeAdmin;
    } catch {
      return rejectWithValue('Could not connect to the server.');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    admin: getSavedAdmin(),
    loading: false,
    error: null,
  },
  reducers: {
    logoutAdmin: state => {
      state.admin = null;
      state.error = null;
      localStorage.removeItem('adminUser');
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginAdmin.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
        localStorage.setItem('adminUser', JSON.stringify(action.payload));
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Admin login failed.';
      });
  },
});

export const { logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;