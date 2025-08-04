import axios from 'axios';
import store, { logoutAdmin } from '../store/store';
import toast from 'react-hot-toast';

const API = axios.create({
  baseURL: "http://localhost:9000/api/v1", // iUtility backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});


API.interceptors.request.use(config => {
  // Add any request interceptors here, e.g., adding auth tokens
  const token = store.getState().auth.token; // Adjust based on your auth strategy
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  // Handle request error
  return Promise.reject(error);
});

const logoutErrors = [
  "Unauthorized",
  "Token expired",
  "Invalid token",
  "Access denied",
  "Forbidden"
]


const logoutClientIfNeeded = async (error) => {
  if (logoutErrors.includes(error.response?.data?.message)) {
    toast.error(error.response?.data?.message || 'Session expired. Please log in again.', {

    });
    setTimeout(() => {
      store.dispatch(logoutAdmin());
    }, 1000); // Delay logout to allow response to complete
  }
};

API.interceptors.response.use(response => {
  // Handle successful responses
  return response;
}, async error => {

  if (logoutErrors.includes(error.response?.data?.message)) {
    // If the error indicates a logout condition, dispatch logout action
    await logoutClientIfNeeded(error);
  }

  return Promise.reject(error);
});

export default API;
