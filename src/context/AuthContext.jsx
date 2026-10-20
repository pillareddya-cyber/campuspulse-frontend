import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getAuthToken, setAuthToken, removeAuthToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function initAuth() {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await api.get('/auth/me');
        setUser(data.user);
      } catch (err) {
        console.warn('Session expired or invalid, logging out.');
        removeAuthToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      setAuthToken(res.token);
      setUser(res.user);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
  };

  const isCoordinator = user?.role === 'COORDINATOR' || user?.role === 'ADMIN';
  const isAdmin = user?.role === 'ADMIN';
  const isStudent = user?.role === 'STUDENT';

  const value = {
    user,
    token: getAuthToken(),
    loading,
    error,
    login,
    logout,
    isCoordinator,
    isAdmin,
    isStudent,
    refreshUser: async () => {
      try {
        const data = await api.get('/auth/me');
        setUser(data.user);
      } catch (e) {}
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
