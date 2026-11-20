import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const STORAGE_KEY = 'wishlistItems';

const loadWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveWishlist = items => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async () => loadWishlist()
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (product, { getState, rejectWithValue }) => {
    const user = getState().auth.user;

    if (!user?.id) {
      return rejectWithValue('Please login');
    }

    const items = loadWishlist();
    const alreadyExists = items.some(
      item => String(item.productId ?? item.id) === String(product.id)
    );

    if (alreadyExists) {
      return rejectWithValue('Product already in wishlist');
    }

    const wishlistItem = {
      ...product,
      id: String(product.id),
      productId: product.id,
      userId: user.id,
    };

    saveWishlist([...items, wishlistItem]);
    return wishlistItem;
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (wishlistId, { rejectWithValue }) => {
    const items = loadWishlist();
    const updatedItems = items.filter(
      item => String(item.id) !== String(wishlistId)
    );

    if (items.length === updatedItems.length) {
      return rejectWithValue('Wishlist item not found');
    }

    saveWishlist(updatedItems);
    return wishlistId;
  }
);

export const clearWishlist = createAsyncThunk(
  'wishlist/clearWishlist',
  async () => {
    saveWishlist([]);
    return true;
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: loadWishlist(),
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
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
          item => String(item.id) !== String(action.payload)
        );
        state.error = null;
      })
      .addCase(clearWishlist.fulfilled, state => {
        state.items = [];
        state.error = null;
      });
  },
});

export default wishlistSlice.reducer;