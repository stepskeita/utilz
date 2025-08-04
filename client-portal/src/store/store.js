import { configureStore, createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {

    token: localStorage.getItem('itopup-token') ? localStorage.getItem('itopup-token') : null,
    client: localStorage.getItem('itopup-client') ? JSON.parse(localStorage.getItem('itopup-client')) : {}

  },
  reducers: {
    loginClient: (state, action) => {
      localStorage.setItem('itopup-token', action.payload.token || '');
      localStorage.setItem('itopup-client', JSON.stringify(action.payload.client || {}));
      state.token = action.payload.token;
      state.client = action.payload.client;
    },
    logoutClient: (state) => {
      localStorage.removeItem('itopup-token');
      localStorage.removeItem('itopup-client');
      state.token = null;
      state.client = {};
    },
  },
});

export const { loginClient, logoutClient } = authSlice.actions;

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export default store;
