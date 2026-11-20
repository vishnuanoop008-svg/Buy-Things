import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'product',

  initialState: {
    products: [],
    searchTerm: '',
    filteredData: []
  },

  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.filteredData = action.payload;
    },

    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;

      const searchValue = action.payload.trim().toLowerCase();

      if (searchValue === '') {
        state.filteredData = state.products;
      } else {
        const exactMatches = state.products.filter(product =>
          product.name.toLowerCase() === searchValue
        );

        state.filteredData = exactMatches.length > 0
          ? exactMatches
          : state.products.filter(product =>
              product.name.toLowerCase().includes(searchValue)
            );
      }
    }
  }
});

export const { setProducts, setSearchTerm } = productSlice.actions;

export default productSlice.reducer;