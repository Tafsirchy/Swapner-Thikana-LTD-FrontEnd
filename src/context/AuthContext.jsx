'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import logger from '@/utils/logger';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    // If we just redirected from Google Auth, the URL will have ?login=success or ?error=...
    const urlParams = new URLSearchParams(window.location.search);
    const isLoginSuccess = urlParams.get('login') === 'success';
    const authError = urlParams.get('error');

    if (isLoginSuccess) {
      import('react-hot-toast').then(({ toast }) => toast.success('Welcome back to Shwapner Thikana!'));
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (authError) {
      import('react-hot-toast').then(({ toast }) => toast.error(decodeURIComponent(authError.replace(/_/g, ' '))));
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    checkAuth();

    // Listen for global 401 errors to clear state
    const handleLogout = () => {
      setUser(null);
    };

    window.addEventListener('auth-user-logout', handleLogout);
    return () => window.removeEventListener('auth-user-logout', handleLogout);
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await api.auth.me();
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await api.auth.login(credentials);
      setUser(response.data.user);
      return { success: true, user: response.data.user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      // console.log('Calling registration API with:', userData);
      const response = await api.auth.register(userData);
      // console.log('Registration API response:', response);
      return { 
        success: true, 
        message: response.data.message,
        emailSent: response.data.emailSent !== false // Default to true if not specified
      };
    } catch (error) {
      logger.error('Registration error', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
      setUser(null);
      // Redirect to home or login
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (error) {
      logger.error('Logout error', error);
    }
  };

  const updateUser = async (userData, shouldCallApi = true) => {
    if (!shouldCallApi) {
      setUser(userData);
      return { success: true };
    }
    try {
      const response = await api.user.updateProfile(userData);
      setUser(response.data.user);
      // Update the user stored in localStorage if applicable (though this context usually relies on state)
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    checkAuth,
    isAuthenticated: !!user,
    isAgent: user?.role === 'agent',
    isAdmin: user?.role === 'admin',
    isCustomer: user?.role === 'customer',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
