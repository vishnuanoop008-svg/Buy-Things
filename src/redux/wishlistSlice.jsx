import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/';
const WISHLIST_URL = `${'http://localhost:5000/wishlist'}/wishlist`;
const PRODUCTS_URL = `${'http://localhost:5000/products'}/products`;

function getUserId(user) {
  return user?.id;
}

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { getState, rejectWithValue }) => {
    try {
      const userId = getUserId(getState().auth.user);

      if (!userId) {
        return rejectWithValue('Please log in to view your wishlist.');
      }

      const [wishlistResponse, productsResponse] = await Promise.all([
        axios.get('http://localhost:5000/wishlist', { params: { userId } }),
        axios.get('http://localhost:5000/products')
      ]);

      const productsById = new Map(
        productsResponse.data.map((product) => [String(product.id), product])
      );

      // Add current product data to saved entries, including older entries
      // that may not have an inStock field.
      return wishlistResponse.data.map((item) => {
        const currentProduct = productsById.get(String(item.productId));

        return currentProduct
          ? { ...currentProduct, ...item, inStock: currentProduct.inStock }
          : item;
      });
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (product, { getState, rejectWithValue }) => {
    try {
      const userId = getUserId(getState().auth.user);

      if (!userId) {
        return rejectWithValue('Please log in to add items to your wishlist.');
      }

      const productId = product.productId ?? product.id;
      const items = getState().wishlist.items;

      const alreadyExists = items.some(
        (item) =>
          String(item.productId ?? item.id) === String(productId)
      );

      if (alreadyExists) {
        return rejectWithValue('This product is already in your wishlist.');
      }

      const response = await axios.post('http://localhost:5000/wishlist', {
        userId,
        productId,
        name: product.name,
        image: product.image,
        price: product.price,
        description: product.description,
        rating: product.rating,
        inStock: product.inStock
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (wishlistItemId, { getState, rejectWithValue }) => {
    try {
      const userId = getUserId(getState().auth.user);

      if (!userId) {
        return rejectWithValue('Please log in first.');
      }

      const item = getState().wishlist.items.find(
        (entry) => String(entry.id) === String(wishlistItemId)
      );

      if (!item || String(item.userId) !== String(userId)) {
        return rejectWithValue('Wishlist item not found.');
      }

      await axios.delete(`${'http://localhost:5000/wishlist'}/${wishlistItemId}`);
      return wishlistItemId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const clearWishlist = createAsyncThunk(
  'wishlist/clearWishlist',
  async (_, { getState, rejectWithValue }) => {
    try {
      const userId = getUserId(getState().auth.user);

      if (!userId) {
        return rejectWithValue('Please log in first.');
      }

      const userItems = getState().wishlist.items.filter(
        (item) => String(item.userId) === String(userId)
      );

      await Promise.all(
        userItems.map((item) =>
          axios.delete(`${'http://localhost:5000/wishlist'}/${item.id}`)
        )
      );

      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    resetWishlist(state) {
      state.items = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => String(item.id) !== String(action.payload)
        );
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(clearWishlist.fulfilled, (state) => {
        state.items = [];
      })
      .addCase(clearWishlist.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  }
});

export const { resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;