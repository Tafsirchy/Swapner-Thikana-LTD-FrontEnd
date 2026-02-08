import axios from 'axios';

const cleanEnvVar = (val) => {
  if (typeof val !== 'string') return val;
  return val.replace(/[\s\n\r\t]/g, '').trim();
};

const apiInstance = axios.create({
  baseURL: (cleanEnvVar(process.env.NEXT_PUBLIC_API_URL) || 'http://localhost:5000/api').replace(/\/?$/, '/'),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Diagnostic check for production baseURL
if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
  const currentBaseURL = apiInstance.defaults.baseURL;
  const envValue = process.env.NEXT_PUBLIC_API_URL;
  
  if (!envValue || currentBaseURL.includes('localhost')) {
    console.warn('[API] CRITICAL: Incorrect NEXT_PUBLIC_API_URL in production!', {
      envValue,
      currentBaseURL,
      expectedToNotBeLocal: true
    });
  } else {
    console.log('[API] Initialized in production with:', currentBaseURL);
  }
}

// Request interceptor to add token
apiInstance.interceptors.request.use(
  (config) => {
    // Token is handled by cookies automatically with withCredentials: true
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for data extraction and 401 handling
apiInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const { config, response } = error;
    
    // Add retry logic
    const MAX_RETRIES = 3;
    config.retryCount = config.retryCount || 0;
    
    // Only retry on network errors or 5xx server errors
    const shouldRetry = !response || (response.status >= 500 && response.status <= 599);
    
    if (shouldRetry && config.retryCount < MAX_RETRIES) {
      config.retryCount += 1;
      const delay = Math.pow(2, config.retryCount) * 1000; // Exponential backoff
      
      console.warn(`[API] Retrying ${config.method?.toUpperCase()} ${config.url} (${config.retryCount}/${MAX_RETRIES}) in ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return apiInstance(config);
    }

    const isAuthMe401 = response?.status === 401 && (config?.url?.includes('auth/me') || config?.url?.includes('/auth/me'));
    const isVerification403 = response?.status === 403 && (response?.data?.message?.toLowerCase().includes('verify') || response?.data?.message?.toLowerCase().includes('authorized'));
    
    if (!config?.suppressErrorLogs && !isAuthMe401 && !isVerification403) {
      console.error(`[API] Error in ${config?.method?.toUpperCase()} ${config?.url}:`, {
        message: error.message,
        status: response?.status,
        data: response?.data,
        headers: response?.headers
      });
      
      if (response?.status === 404) {
        console.warn('[API] 404 detected. This could be a routing mismatch between frontend and backend, or Vercel not mapping the path.');
      }
    }
    
    // Only redirect to login if:
    // 1. It's a 401 error
    // 2. NOT from /auth/me (checking auth status)
    // 3. NOT already on auth pages
    // 4. User is on a protected route (dashboard, etc.)
    if (response?.status === 401 && !isAuthMe401) {
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const isProtectedRoute = currentPath.startsWith('/dashboard') || 
                                 currentPath.startsWith('/profile') ||
                                 currentPath.startsWith('/saved');
        
        // Only redirect if on a protected route and not already on auth page
        if (isProtectedRoute && !currentPath.startsWith('/auth/')) {
          window.location.href = '/auth/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  auth: {
    register: (data) => apiInstance.post('auth/register', data),
    login: (data) => 
      apiInstance.post('auth/login', data),
    me: () => apiInstance.get('auth/me'),
    changePassword: (data) => apiInstance.post('auth/change-password', data),
    verifyEmail: (token) => apiInstance.post('auth/verify-email', { token }),
    resendVerification: (data) => apiInstance.post('auth/resend-verification', data),
    forgotPassword: (email) => apiInstance.post('auth/forgot-password', { email }),
    resetPassword: (token, password) => apiInstance.post('auth/reset-password', { token, password }),
    logout: async () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      return apiInstance.post('auth/logout');
    }
  },
  user: {
    getProfile: () => apiInstance.get('users/profile'),
    updateProfile: (data) => {
      const isFormData = data instanceof FormData;
      return apiInstance.put('users/profile', data, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined
      });
    },
    deleteProfileImage: () => apiInstance.delete('users/profile/image'),
    getSavedProperties: () => apiInstance.get('users/saved-properties'),
    addToWishlist: (propertyId) => apiInstance.post(`users/saved-properties/${propertyId}`),
    removeFromWishlist: (propertyId) => apiInstance.delete(`users/saved-properties/${propertyId}`),
    getAgents: () => apiInstance.get('users/agents'),
    getRecentlyViewed: () => apiInstance.get('users/recently-viewed'),
    addRecentlyViewed: (propertyId) => apiInstance.post(`users/recently-viewed/${propertyId}`),
  },
  properties: {
    getAll: (params) => apiInstance.get('properties', { params }),
    getMyProperties: (params) => apiInstance.get('properties/my-listings', { params }),
    getById: (id) => apiInstance.get(`properties/id/${id}`),
    getBySlug: (slug) => apiInstance.get(`properties/slug/${slug}`),
    create: (data) => apiInstance.post('properties', data),
    update: (id, data) => apiInstance.put(`properties/${id}`, data),
    delete: (id) => apiInstance.delete(`properties/${id}`),
    toggleSave: (id) => apiInstance.post(`properties/${id}/save`),
    uploadImages: (id, data) => apiInstance.post(`properties/${id}/images`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  },
  public: {
    getItemsByIds: (ids) => apiInstance.get('public/items', { params: { ids: ids.join(',') } }),
  },
  projects: {
    getAll: (params) => apiInstance.get('projects', { params }),
    getById: (id) => apiInstance.get(`projects/id/${id}`),
    getBySlug: (slug) => apiInstance.get(`projects/slug/${slug}`),
    create: (data) => apiInstance.post('projects', data),
    update: (id, data) => apiInstance.put(`projects/${id}`, data),
    delete: (id) => apiInstance.delete(`projects/${id}`),
  },
  leads: {
    create: (data) => apiInstance.post('leads', data),
    getAll: () => apiInstance.get('leads'),
    getMyInquiries: () => apiInstance.get('leads/my-inquiries'),
    updateStatus: (id, status) => apiInstance.patch(`leads/${id}/status`, { status }),
    addNote: (id, text) => apiInstance.post(`leads/${id}/notes`, { text }),
    delete: (id) => apiInstance.delete(`leads/${id}`),
  },
  blogs: {
    getAll: (params) => apiInstance.get('blogs', { params }),
    getById: (id) => apiInstance.get(`blogs/id/${id}`),
    getBySlug: (slug) => apiInstance.get(`blogs/slug/${slug}`),
    create: (data) => apiInstance.post('blogs', data),
    update: (id, data) => apiInstance.put(`blogs/${id}`, data),
    delete: (id) => apiInstance.delete(`blogs/${id}`),
  },
  admin: {
    getDashboard: () => apiInstance.get('admin/dashboard'),
    getUsers: (params) => apiInstance.get('admin/users', { params }),
    updateUserRole: (userId, role) => apiInstance.put(`admin/users/${userId}/role`, { role }),
    updateUserStatus: (userId, status) => apiInstance.put(`admin/users/${userId}/status`, { status }),
    deleteUser: (userId) => apiInstance.delete(`admin/users/${userId}`),
    getProperties: (params) => apiInstance.get('admin/properties', { params }),
    approveProperty: (propertyId) => apiInstance.put(`admin/properties/${propertyId}/approve`),
    rejectProperty: (propertyId, reason) => apiInstance.put(`admin/properties/${propertyId}/reject`, { reason }),
    toggleFeatured: (propertyId, featured) => apiInstance.put(`admin/properties/${propertyId}/feature`, { featured }),
    getEmailTemplates: () => apiInstance.get('admin/email-templates'),
  },
  savedSearches: {
    create: (data) => apiInstance.post('saved-searches', data),
    getAll: () => apiInstance.get('saved-searches'),
    getById: (id) => apiInstance.get(`saved-searches/${id}`),
    update: (id, data) => apiInstance.put(`saved-searches/${id}`, data),
    delete: (id) => apiInstance.delete(`saved-searches/${id}`),
    getMatches: (id) => apiInstance.get(`saved-searches/${id}/matches`),
  },
  notifications: {
    getAll: (params) => apiInstance.get('notifications', { params }),
    markAsRead: (id) => apiInstance.put(`notifications/${id}/read`),
    markAllAsRead: () => apiInstance.put('notifications/read-all'),
    delete: (id) => apiInstance.delete(`notifications/${id}`),
    registerFcmToken: (token) => apiInstance.post('notifications/fcm-token', { token }),
    sendTest: () => apiInstance.post('notifications/test'),
  },
  seller: {
    submitInquiry: (data) => apiInstance.post('seller/submit', data),
    getAllInquiries: (params) => apiInstance.get('seller/admin/all', { params }),
    updateStatus: (id, status) => apiInstance.put(`seller/admin/${id}/status`, { status }),
  },
  // Duplicate brace removed
  reviews: {
    create: (data) => apiInstance.post('reviews', data),
    update: (id, data) => apiInstance.put(`reviews/${id}`, data),
    getPropertyReviews: (propertyId) => apiInstance.get(`reviews/property/${propertyId}`),
    getAgentReviews: (agentId) => apiInstance.get(`reviews/agent/${agentId}`),
    getAllAdmin: (params) => apiInstance.get('reviews/admin/all', { params }),
    updateStatus: (id, status) => apiInstance.put(`reviews/${id}/status`, { status }),
    delete: (id) => apiInstance.delete(`reviews/${id}`),
  },
  analytics: {
    getAdmin: () => apiInstance.get('analytics/admin'),
    getAgent: () => apiInstance.get('analytics/agent'),
    getCustomer: () => apiInstance.get('analytics/customer'),
  },
  reminders: {
    create: (data) => apiInstance.post('reminders', data),
    getAll: (params) => apiInstance.get('reminders', { params }),
    complete: (id, isCompleted) => apiInstance.patch(`reminders/${id}/complete`, { isCompleted }),
    delete: (id) => apiInstance.delete(`reminders/${id}`),
  },
  wishlists: {
    getAll: () => apiInstance.get('wishlists'),
    create: (data) => apiInstance.post('wishlists', data),
    update: (id, data) => apiInstance.patch(`wishlists/${id}`, data),
    delete: (id) => apiInstance.delete(`wishlists/${id}`),
    getProperties: (id) => apiInstance.get(`wishlists/${id}/properties`),
    addProperty: (wishlistId, propertyId) => apiInstance.post(`wishlists/${wishlistId}/properties/${propertyId}`),
    removeProperty: (wishlistId, propertyId) => apiInstance.delete(`wishlists/${wishlistId}/properties/${propertyId}`),
  },
  agencies: {
    getAll: (params) => apiInstance.get('agencies', { params }),
    getById: (id) => apiInstance.get(`agencies/id/${id}`),
    getBySlug: (slug) => apiInstance.get(`agencies/${slug}`),
    create: (data) => apiInstance.post('agencies', data),
    update: (id, data) => apiInstance.put(`agencies/${id}`, data),
    delete: (id) => apiInstance.delete(`agencies/${id}`),
  },
  management: {
    getAll: (params) => apiInstance.get('management', { params }),
    getById: (id) => apiInstance.get(`management/${id}`),
    create: (data) => apiInstance.post('management', data),
    update: (id, data) => apiInstance.put(`management/${id}`, data),
    delete: (id) => apiInstance.delete(`management/${id}`),
  },
  agents: {
    getAll: (params) => apiInstance.get('agents', { params }),
    getById: (id) => apiInstance.get(`agents/${id}`),
    create: (data) => apiInstance.post('agents', data),
    update: (id, data) => apiInstance.put(`agents/${id}`, data),
    delete: (id) => apiInstance.delete(`agents/${id}`),
  },
  magazines: {
    getAll: (params) => apiInstance.get('magazines', { params }),
    getById: (id) => apiInstance.get(`magazines/id/${id}`),
    getBySlug: (slug) => apiInstance.get(`magazines/${slug}`),
    create: (data) => apiInstance.post('magazines', data),
    update: (id, data) => apiInstance.put(`magazines/${id}`, data),
    delete: (id) => apiInstance.delete(`magazines/${id}`),
  },
  uploads: {
    upload: (data, config) => apiInstance.post('upload', data, config),
    uploadPublic: (data, config) => apiInstance.post('upload/public', data, config),
  },
  history: {
    getPublic: () => apiInstance.get('history'),
    getAllAdmin: () => apiInstance.get('history/admin'),
    getById: (id) => apiInstance.get(`history/${id}`),
    create: (data) => apiInstance.post('history', data),
    update: (id, data) => apiInstance.put(`history/${id}`, data),
    delete: (id) => apiInstance.delete(`history/${id}`),
  },
  regions: {
    getAll: () => apiInstance.get('regions'),
    getById: (id) => apiInstance.get(`regions/${id}/projects`),
    update: (id, data) => apiInstance.put(`regions/admin/${id}`, data),
  },
  masterPlan: {
    getAllProjects: (params) => apiInstance.get('master-plan/projects', { params }),
    linkProject: (data) => apiInstance.post('master-plan/admin/region-projects', data),
    getLinks: (params) => apiInstance.get('master-plan/admin/region-projects', { params }),
    updateLink: (id, data) => apiInstance.put(`master-plan/admin/region-projects/${id}`, data),
    deleteLink: (id) => apiInstance.delete(`master-plan/admin/region-projects/${id}`),
  }
};


export default api;
