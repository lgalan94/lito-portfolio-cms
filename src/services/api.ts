
import axios from 'axios';

const VITE_API_BASE_URL = 'http://localhost:4001/api';

const api = axios.create({
  baseURL: VITE_API_BASE_URL,
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
