import axios from 'axios';

/**
 * Axios API client configured with base URL and auth token from localStorage.
 * Uses REACT_APP_API_BASE environment variable for base URL.
 */
const client = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || '',
  withCredentials: false,
});

// Attach auth token when present
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
