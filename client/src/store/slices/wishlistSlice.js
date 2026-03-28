import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
  },
  reducers: {
    // ✅ Wishlist-ல் add
    addToWishlist(state, action) {
      const newItem = action.payload;
      const exists = state.items.find(item => item.id === newItem.id);
      if (!exists) {
        state.items.push(newItem);
      }
    },

    // ✅ Wishlist-இருந்து remove
    removeFromWishlist(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },

    // ✅ Wishlist-ல் இருக்கா இல்லையான்னு toggle
    toggleWishlist(state, action) {
      const newItem = action.payload;
      const exists = state.items.find(item => item.id === newItem.id);
      if (exists) {
        state.items = state.items.filter(item => item.id !== newItem.id);
      } else {
        state.items.push(newItem);
      }
    },

    // ✅ Wishlist clear
    clearWishlist(state) {
      state.items = [];
    },
  },
});

export const { addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;