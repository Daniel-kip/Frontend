import axios from 'axios';

let accessToken = null; // store JWT in memory

// Create Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5031/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===== Helper functions =====

// Set the access token globally
export function setAccessToken(token) {
  accessToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

// Clear access token
export function clearAccessToken() {
  accessToken = null;
  delete api.defaults.headers.common['Authorization'];
}

// Automatically attach Authorization header to each request if we have a token
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Enhanced error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.config?.url,
        data: error.response.data
      });
      
      if (error.response.status === 401) {
        console.warn('Unauthorized: possible expired token');
        clearAccessToken();
        // Optional: redirect to login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error:', {
        message: error.message,
        url: error.config?.url
      });
    } else {
      // Something else happened
      console.error('Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Test function to verify backend connection
export const testBackendConnection = async () => {
  try {
    const response = await api.get('/Auth/Test');
    console.log(' Backend connection successful:', response.data);
    return true;
  } catch (error) {
    console.error(' Backend connection failed:', error.message);
    return false;
  }
};

export default api;