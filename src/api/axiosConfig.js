import axios from 'axios';

let accessToken = null;

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5031/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

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
