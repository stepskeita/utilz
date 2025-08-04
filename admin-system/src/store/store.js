import { configureStore, createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {

    token: localStorage.getItem('itopup-admin-token') ? localStorage.getItem('itopup-admin-token') : null,
    user: localStorage.getItem('itopup-admin-user') ? JSON.parse(localStorage.getItem('itopup-admin-user')) : {}

  },
  reducers: {
    loginAdmin: (state, action) => {
      localStorage.setItem('itopup-admin-token', action.payload.tokens?.accessToken || '');
      localStorage.setItem('itopup-admin-user', JSON.stringify(action.payload.user || {}));
      state.token = action.payload.tokens?.accessToken;
      state.user = action.payload.user || {};
    },
    logoutAdmin: (state) => {
      localStorage.removeItem('itopup-admin-token');
      localStorage.removeItem('itopup-admin-user');
      state.token = null;
      state.user = {};
    },
  },
});

export const { loginAdmin, logoutAdmin } = authSlice.actions;

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export default store;
