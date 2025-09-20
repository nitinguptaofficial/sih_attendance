import axios from 'axios';

// When testing on Android emulator, use 10.0.2.2 instead of localhost
// When testing on iOS simulator, use localhost
// When testing on physical device, use your computer's IP address on the same network
const API_BASE_URL = 'http://192.168.1.107:5000/api'; // Your backend server URL

console.log('Using API URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000, // 30 second timeout
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Don't reject if status is not 2xx
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  config => {
    console.log(`Making request to: ${config.baseURL}${config.url}`);
    console.log('Request headers:', config.headers);
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  },
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    } else if (!error.response) {
      console.error('Network error - no response received');
      console.error('Check if:');
      console.error('1. Backend server is running');
      console.error('2. Device and server are on same network');
      console.error('3. Server IP and port are correct');
      console.error('4. No firewall blocking the connection');
    } else {
      console.error(
        'Server error:',
        error.response.status,
        error.response.data,
      );
    }
    return Promise.reject(error);
  },
);

export default api;
