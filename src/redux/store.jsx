import { configureStore } from '@reduxjs/toolkit';

import productSlice from './productSlice';
import cartSlice from './cartSlice';
import wishlistSlice from './wishlistSlice';
import authSlice from './authSlice';

const store = configureStore({
  reducer: {
    cart: cartSlice,
    product: productSlice,
    wishlist: wishlistSlice,
    auth: authSlice,
  },
});

store.subscribe(() => {
  const products = store.getState().cart.products;
  localStorage.setItem('cartItems', JSON.stringify(products));
});

export default store;