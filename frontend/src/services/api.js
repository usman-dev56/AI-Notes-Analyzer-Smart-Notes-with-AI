// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api';

// // Create axios instance
// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 10000, // 10 seconds timeout
// });

// // Add token to requests
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Handle responses and errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Network error
//     if (!error.response) {
//       error.response = {
//         data: {
//           error: 'Network error. Please check your internet connection.'
//         },
//         status: 0
//       };
//     }
    
//     // Authentication error
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       // Only redirect if not already on login page
//       if (!window.location.pathname.includes('/login')) {
//         window.location.href = '/login';
//       }
//     }
    
//     // Server error
//     if (error.response?.status >= 500) {
//       error.response.data = {
//         error: 'Server error. Please try again later.'
//       };
//     }
    
//     // Timeout error
//     if (error.code === 'ECONNABORTED') {
//       error.response = {
//         data: {
//           error: 'Request timeout. Please try again.'
//         },
//         status: 408
//       };
//     }
    
//     return Promise.reject(error);
//   }
// );

// export default api;








import axios from 'axios';

// Try these different options - one of them should work
const API_URL = 'http://localhost:5000/api'; // Most common
// const API_URL = 'http://127.0.0.1:5000/api'; // Alternative
// const API_URL = '/api'; // If using Vite proxy

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add detailed logging
api.interceptors.request.use(
  (config) => {
    console.log('🔄 API Request:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      fullURL: config.baseURL + config.url
    });
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request setup error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response success:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Response error:', {
      url: error.config?.url,
      method: error.config?.method,
      baseURL: error.config?.baseURL,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      code: error.code
    });
    
    // Enhanced error handling
    if (error.code === 'ECONNREFUSED') {
      error.response = {
        data: {
          error: 'Cannot connect to server. Please ensure the backend is running on http://localhost:5000'
        }
      };
    } else if (error.code === 'NETWORK_ERROR') {
      error.response = {
        data: {
          error: 'Network error. Please check your internet connection and ensure backend is running.'
        }
      };
    } else if (!error.response) {
      error.response = {
        data: {
          error: 'Server is not responding. Please check if backend is running on port 5000.'
        }
      };
    }
    
    return Promise.reject(error);
  }
);

export default api;