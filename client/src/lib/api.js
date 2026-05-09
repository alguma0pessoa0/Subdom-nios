import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
  refreshToken: () => api.post('/auth/refresh', {}),
};

export const scanAPI = {
  createScan: (data) => api.post('/scan', data),
  getScan: (id) => api.get(`/scan/${id}`),
  getScanHistory: (limit, offset) => 
    api.get('/scan', { params: { limit, offset } }),
  exportScan: (id, format) => 
    api.get(`/scan/${id}/export`, { params: { format } }),
};

export const apiKeyAPI = {
  generateKey: (data) => api.post('/api-keys', data),
  getKeys: () => api.get('/api-keys'),
  revokeKey: (id) => api.delete(`/api-keys/${id}`),
};

export { api };
