import { createSlice } from '@reduxjs/toolkit';

const getFilteredProducts = (products, searchTerm) => {
  const query = String(searchTerm ?? '').trim().toLowerCase();

  if (!query) return products;

  return products.filter(product =>
    String(product.name ?? '').toLowerCase().includes(query)
  );
};

const productSlice = createSlice({
  name: 'product',

  initialState: {
    products: [],
    searchTerm: '',
    filteredData: [],
  },

  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload ?? [];
      state.filteredData = getFilteredProducts(
        state.products,
        state.searchTerm
      );
    },

    setSearchTerm: (state, action) => {
      state.searchTerm = String(action.payload ?? '');
      state.filteredData = getFilteredProducts(
        state.products,
        state.searchTerm
      );
    },
  },
});

export const { setProducts, setSearchTerm } = productSlice.actions;

export default productSlice.reducer;