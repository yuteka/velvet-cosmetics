import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: '',
  type: 'info', // success, error, info, warning
  show: false,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type || 'info';
      state.show = true;
    },
    hideNotification: (state) => {
      state.show = false;
      state.message = '';
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;