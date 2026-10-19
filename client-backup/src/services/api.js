
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
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

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
};

// Patient API
export const patientAPI = {
    getAll: (params) => api.get('/patients', { params }),
    getById: (id) => api.get(`/patients/${id}`),
    create: (data) => api.post('/patients', data),
    update: (id, data) => api.put(`/patients/${id}`, data),
    delete: (id) => api.delete(`/patients/${id}`),
};

// X-Ray API
export const xrayAPI = {
    upload: (formData) => api.post('/xrays/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    analyze: (id) => api.post(`/xrays/analyze/${id}`),
    getByPatient: (patientId) => api.get(`/xrays/patient/${patientId}`),
    getById: (id) => api.get(`/xrays/${id}`),
    delete: (id) => api.delete(`/xrays/${id}`),
};

// Report API
export const reportAPI = {
    create: (data) => api.post('/reports', data),
    getById: (id) => api.get(`/reports/${id}`),
    getByPatient: (patientId) => api.get(`/reports/patient/${patientId}`),
    update: (id, data) => api.put(`/reports/${id}`, data),
    delete: (id) => api.delete(`/reports/${id}`),
};

// Dashboard API
export const dashboardAPI = {
    getStats: () => api.get('/dashboard/stats'),
    getTrends: (period) => api.get('/dashboard/trends', { params: { period } }),
};

export default api;
