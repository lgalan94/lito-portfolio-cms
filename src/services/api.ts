import axios from 'axios';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: VITE_API_BASE_URL,
});

// 🔹 Request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
