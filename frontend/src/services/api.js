import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true // Important for PHP sessions
});

// Interceptor to handle errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Redirect to login if needed, or handle globally
            console.warn('Unauthorized access, redirecting to login...');
            // window.location.href = '/login'; // Optional: Use router for smoother transition
        }
        return Promise.reject(error);
    }
);

export default api;
