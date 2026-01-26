import axios from 'axios';

const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
apiInstance.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for data extraction and 401 handling
apiInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  auth: {
    register: (data) => apiInstance.post('/auth/register', data),
    login: (data) => 
      apiInstance.post('/auth/login', data).then(res => {
        if (typeof window !== 'undefined' && res.data.token) {
          localStorage.setItem('token', res.data.token);
        }
        return res;
      }),
    me: () => apiInstance.get('/auth/me'),
    verifyEmail: (token) => apiInstance.post('/auth/verify-email', { token }),
    forgotPassword: (email) => apiInstance.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => apiInstance.post('/auth/reset-password', { token, password }),
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      return Promise.resolve({ success: true });
    }
  },
  user: {
    updateProfile: (data) => apiInstance.put('/users/profile', data),
    getPublicProfile: (id) => apiInstance.get(`/users/${id}`),
    getSavedProperties: () => apiInstance.get('/users/saved-properties'),
  },
  properties: {
    getAll: (params) => apiInstance.get('/properties', { params }),
    getMyProperties: (params) => apiInstance.get('/properties/my-listings', { params }),
    getById: (id) => apiInstance.get(`/properties/id/${id}`),
    getBySlug: (slug) => apiInstance.get(`/properties/slug/${slug}`),
    create: (data) => apiInstance.post('/properties', data),
    update: (id, data) => apiInstance.put(`/properties/${id}`, data),
    delete: (id) => apiInstance.delete(`/properties/${id}`),
    toggleSave: (id) => apiInstance.post(`/properties/${id}/save`),
  },
  projects: {
    getAll: () => apiInstance.get('/projects'),
    getById: (id) => apiInstance.get(`/projects/id/${id}`),
    getBySlug: (slug) => apiInstance.get(`/projects/slug/${slug}`),
    create: (data) => apiInstance.post('/projects', data),
    update: (id, data) => apiInstance.put(`/projects/${id}`, data),
    delete: (id) => apiInstance.delete(`/projects/${id}`),
  },
  leads: {
    create: (data) => apiInstance.post('/leads', data),
    getAll: () => apiInstance.get('/leads'),
    getMyInquiries: () => apiInstance.get('/leads/my-inquiries'),
    updateStatus: (id, status) => apiInstance.patch(`/leads/${id}/status`, { status }),
  },
  blogs: {
    getAll: (params) => apiInstance.get('/blogs', { params }),
    getById: (id) => apiInstance.get(`/blogs/id/${id}`),
    getBySlug: (slug) => apiInstance.get(`/blogs/slug/${slug}`),
    create: (data) => apiInstance.post('/blogs', data),
    update: (id, data) => apiInstance.put(`/blogs/${id}`, data),
    delete: (id) => apiInstance.delete(`/blogs/${id}`),
  }
};

export default api;
