import { handleMockRequest } from './mockApi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('seedvault_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Check if response is HTML (e.g. 404 page from host) instead of valid JSON
    const contentType = response.headers.get('content-type') || '';
    if (!response.ok || !contentType.includes('application/json')) {
      return await handleMockRequest(endpoint, options);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // If anything fails (network error, SyntaxError on HTML, offline host), fall back cleanly
    return await handleMockRequest(endpoint, options);
  }
};

export const api = {
  get: (endpoint, options) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) => request(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }),
  put: (endpoint, body, options) => request(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options }),
  delete: (endpoint, options) => request(endpoint, { method: 'DELETE', ...options }),
};

export default api;
