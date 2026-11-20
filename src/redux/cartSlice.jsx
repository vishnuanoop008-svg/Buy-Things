import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/cart';

const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem('cartItems') || '[]');
  } catch {
    return [];
  }
};

const savedProducts = loadCart();

const calculateTotals = state => {
  state.totalQuantity = state.products.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  state.totalPrice = state.products.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
};

export const fetchUserCart = createAsyncThunk(
  'cart/fetchUserCart',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${'http://localhost:5000/cart'}?userId=${encodeURIComponent(userId)}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (product, { getState, rejectWithValue }) => {
    try {
      const user = getState().auth.user;

      if (!user?.id) return rejectWithValue('Please login first!');

      const productId = product.productId ?? product.id;
      if (productId == null) return rejectWithValue('Product ID is missing!');

      const response = await axios.get(
        `${'http://localhost:5000/cart'}?userId=${encodeURIComponent(user.id)}`
      );

      const existingItem = response.data.find(
        item => String(item.productId) === String(productId)
      );

      if (existingItem) {
        const updated = await axios.patch(`${API_URL}/${existingItem.id}`, {
          quantity: Number(existingItem.quantity || 1) + 1,
        });
        return updated.data;
      }

      const result = await axios.post('http://localhost:5000/cart', {
        userId: user.id,
        productId,
        name: product.name,
        price: Number(product.price),
        quantity: 1,
        image: product.image || product.src || '',
      });

      return result.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue }) => {
    try {
      await axios.delete(`${'http://localhost:5000/cart'}/${itemId}`);
      return itemId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const increaseQuantity = createAsyncThunk(
  'cart/increaseQuantity',
  async (itemId, { getState, rejectWithValue }) => {
    try {
      const item = getState().cart.products.find(
        product => String(product.id) === String(itemId)
      );

      if (!item) return rejectWithValue('Product not found!');

      const response = await axios.patch(`${'http://localhost:5000/cart'}/${item.id}`, {
        quantity: Number(item.quantity) + 1,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const decreaseQuantity = createAsyncThunk(
  'cart/decreaseQuantity',
  async (itemId, { getState, rejectWithValue }) => {
    try {
      const item = getState().cart.products.find(
        product => String(product.id) === String(itemId)
      );

      if (!item) return rejectWithValue('Product not found!');
      if (Number(item.quantity) <= 1) {
        return rejectWithValue('Minimum quantity is 1');
      }

      const response = await axios.patch(`${'http://localhost:5000/cart'}/${item.id}`, {
        quantity: Number(item.quantity) - 1,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',

  initialState: {
    products: savedProducts,
    totalQuantity: savedProducts.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    ),
    totalPrice: savedProducts.reduce(
      (total, item) =>
        total + Number(item.price || 0) * Number(item.quantity || 0),
      0
    ),
    loading: false,
    error: null,
  },

  reducers: {
    clearCartState: state => {
      state.products = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(fetchUserCart.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCart.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload) ? action.payload : [];
        calculateTotals(state);
      })
      .addCase(fetchUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addToCart.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.products.findIndex(
          item => String(item.id) === String(action.payload.id)
        );

        if (index >= 0) {
          state.products[index] = action.payload;
        } else {
          state.products.push(action.payload);
        }

        calculateTotals(state);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.products = state.products.filter(
          item => String(item.id) !== String(action.payload)
        );
        calculateTotals(state);
      })
      .addCase(increaseQuantity.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          item => String(item.id) === String(action.payload.id)
        );

        if (index >= 0) state.products[index] = action.payload;
        calculateTotals(state);
      })
      .addCase(decreaseQuantity.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          item => String(item.id) === String(action.payload.id)
        );

        if (index >= 0) state.products[index] = action.payload;
        calculateTotals(state);
      });
  },
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;