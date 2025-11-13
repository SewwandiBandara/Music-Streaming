import axios from 'axios';

// Base API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.patch('/auth/me', data),
  logout: () => api.post('/auth/logout'),
};

// Song APIs
export const songAPI = {
  getAll: (params) => api.get('/songs', { params }),
  getById: (id) => api.get(`/songs/${id}`),
  getTrending: (limit = 20) => api.get(`/songs/trending/top?limit=${limit}`),
  stream: (id) => `${API_URL.replace('/api', '')}/api/songs/stream/${id}`,
  upload: (formData) => api.post('/songs/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  like: (id) => api.post(`/songs/${id}/like`),
  update: (id, data) => api.patch(`/songs/${id}`, data),
  delete: (id) => api.delete(`/songs/${id}`),
};

// Playlist APIs
export const playlistAPI = {
  getAll: (params) => api.get('/playlists', { params }),
  getMyPlaylists: () => api.get('/playlists/my-playlists'),
  getById: (id) => api.get(`/playlists/${id}`),
  create: (data) => api.post('/playlists', data),
  update: (id, data) => api.patch(`/playlists/${id}`, data),
  delete: (id) => api.delete(`/playlists/${id}`),
  addSong: (id, songId) => api.post(`/playlists/${id}/songs`, { songId }),
  removeSong: (playlistId, songId) => api.delete(`/playlists/${playlistId}/songs/${songId}`),
  reorder: (id, songIds) => api.put(`/playlists/${id}/reorder`, { songIds }),
};

// Artist APIs
export const artistAPI = {
  getAll: (params) => api.get('/artists', { params }),
  getById: (id) => api.get(`/artists/${id}`),
  getSongs: (id, params) => api.get(`/artists/${id}/songs`, { params }),
  follow: (id) => api.post(`/artists/${id}/follow`),
  create: (data) => api.post('/artists', data),
  update: (id, data) => api.patch(`/artists/${id}`, data),
};

// Search APIs
export const searchAPI = {
  search: (query, type = 'all', limit = 10) =>
    api.get('/search', { params: { q: query, type, limit } }),
  getSuggestions: (query) => api.get('/search/suggestions', { params: { q: query } }),
};

export default api;
