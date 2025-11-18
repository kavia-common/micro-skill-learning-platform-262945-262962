import axios from 'axios';

/**
 * Axios API client configured with base URL and auth token from localStorage.
 * Order of precedence for base URL:
 * - REACT_APP_API_BASE
 * - REACT_APP_BACKEND_URL
 * - Fallback to same-origin ("")
 */
const baseURL =
  process.env.REACT_APP_API_BASE ||
  process.env.REACT_APP_BACKEND_URL ||
  '';

const client = axios.create({
  baseURL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Attach auth token when present
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    // Ensure headers object exists
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
