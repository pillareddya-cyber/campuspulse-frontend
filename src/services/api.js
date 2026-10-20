const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '') + '/api';
export const UPLOAD_BASE = import.meta.env.VITE_API_URL || '';

export const getAuthToken = () => localStorage.getItem('campuspulse_token');
export const setAuthToken = (token) => localStorage.setItem('campuspulse_token', token);
export const removeAuthToken = () => localStorage.removeItem('campuspulse_token');

export async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is NOT FormData, default to application/json
  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  let data = null;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = data && data.error ? data.error : response.statusText || 'Request failed';
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => request(endpoint, { 
    method: 'POST', 
    body: body instanceof FormData ? body : JSON.stringify(body) 
  }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
  upload: (endpoint, formData) => request(endpoint, {
    method: 'POST',
    body: formData
  })
};

export default api;
