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
    changePassword: (data) => apiInstance.post('/auth/change-password', data),
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
    getProfile: () => apiInstance.get('/users/profile'),
    updateProfile: (data) => apiInstance.put('/users/profile', data),
    getSavedProperties: () => apiInstance.get('/users/saved-properties'),
    addToWishlist: (propertyId) => apiInstance.post(`/users/saved-properties/${propertyId}`),
    removeFromWishlist: (propertyId) => apiInstance.delete(`/users/saved-properties/${propertyId}`),
    getAgents: () => apiInstance.get('/users/agents'),
    getRecentlyViewed: () => apiInstance.get('/users/recently-viewed'),
    addRecentlyViewed: (propertyId) => apiInstance.post(`/users/recently-viewed/${propertyId}`),
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
    addNote: (id, text) => apiInstance.post(`/leads/${id}/notes`, { text }),
  },
  blogs: {
    getAll: (params) => apiInstance.get('/blogs', { params }),
    getById: (id) => apiInstance.get(`/blogs/id/${id}`),
    getBySlug: (slug) => apiInstance.get(`/blogs/slug/${slug}`),
    create: (data) => apiInstance.post('/blogs', data),
    update: (id, data) => apiInstance.put(`/blogs/${id}`, data),
    delete: (id) => apiInstance.delete(`/blogs/${id}`),
  },
  admin: {
    getDashboard: () => apiInstance.get('/admin/dashboard'),
    getUsers: (params) => apiInstance.get('/admin/users', { params }),
    updateUserRole: (userId, role) => apiInstance.put(`/admin/users/${userId}/role`, { role }),
    updateUserStatus: (userId, isActive) => apiInstance.put(`/admin/users/${userId}/status`, { isActive }),
    deleteUser: (userId) => apiInstance.delete(`/admin/users/${userId}`),
    getProperties: (params) => apiInstance.get('/admin/properties', { params }),
    approveProperty: (propertyId) => apiInstance.put(`/admin/properties/${propertyId}/approve`),
    rejectProperty: (propertyId, reason) => apiInstance.put(`/admin/properties/${propertyId}/reject`, { reason }),
    toggleFeatured: (propertyId, featured) => apiInstance.put(`/admin/properties/${propertyId}/feature`, { featured }),
    getEmailTemplates: () => apiInstance.get('/admin/email-templates'),
  },
  savedSearches: {
    create: (data) => apiInstance.post('/saved-searches', data),
    getAll: () => apiInstance.get('/saved-searches'),
    getById: (id) => apiInstance.get(`/saved-searches/${id}`),
    update: (id, data) => apiInstance.put(`/saved-searches/${id}`, data),
    delete: (id) => apiInstance.delete(`/saved-searches/${id}`),
    getMatches: (id) => apiInstance.get(`/saved-searches/${id}/matches`),
  },
  notifications: {
    getAll: (params) => apiInstance.get('/notifications', { params }),
    markAsRead: (id) => apiInstance.put(`/notifications/${id}/read`),
    markAllAsRead: () => apiInstance.put('/notifications/read-all'),
    delete: (id) => apiInstance.delete(`/notifications/${id}`),
    registerFcmToken: (token) => apiInstance.post('/notifications/fcm-token', { token }),
    sendTest: () => apiInstance.post('/notifications/test'),
  },
  reviews: {
    create: (data) => apiInstance.post('/reviews', data),
    getPropertyReviews: (propertyId) => apiInstance.get(`/reviews/property/${propertyId}`),
    getAgentReviews: (agentId) => apiInstance.get(`/reviews/agent/${agentId}`),
    getAllAdmin: (params) => apiInstance.get('/reviews/admin/all', { params }),
    updateStatus: (id, status) => apiInstance.put(`/reviews/${id}/status`, { status }),
    delete: (id) => apiInstance.delete(`/reviews/${id}`),
  },
  analytics: {
    getAdmin: () => apiInstance.get('/analytics/admin'),
    getAgent: () => apiInstance.get('/analytics/agent'),
  },
  reminders: {
    create: (data) => apiInstance.post('/reminders', data),
    getAll: (params) => apiInstance.get('/reminders', { params }),
    complete: (id, isCompleted) => apiInstance.patch(`/reminders/${id}/complete`, { isCompleted }),
    delete: (id) => apiInstance.delete(`/reminders/${id}`),
  },
  wishlists: {
    getAll: () => apiInstance.get('/wishlists'),
    create: (data) => apiInstance.post('/wishlists', data),
    update: (id, data) => apiInstance.patch(`/wishlists/${id}`, data),
    delete: (id) => apiInstance.delete(`/wishlists/${id}`),
    getProperties: (id) => apiInstance.get(`/wishlists/${id}/properties`),
    addProperty: (wishlistId, propertyId) => apiInstance.post(`/wishlists/${wishlistId}/properties/${propertyId}`),
    removeProperty: (wishlistId, propertyId) => apiInstance.delete(`/wishlists/${wishlistId}/properties/${propertyId}`),
  }
};

export default api;
