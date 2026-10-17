import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 Unauthorized on a protected route (excluding /auth/me or /auth/login), notify or redirect if needed
    if (error.response && error.response.status === 401) {
      const url = error.config ? error.config.url : '';
      if (!url.includes('/auth/login') && !url.includes('/auth/me')) {
        // Let AuthContext handle session expiry if requested
        console.warn('Session expired or unauthorized request to:', url);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
