import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import api from '../services/api';
import type { User, AuthState, AuthContextType } from '../types';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(initialState.user);
  const [token, setToken] = useState<string | null>(initialState.token);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialState.isAuthenticated);
  const [isLoading, setIsLoading] = useState<boolean>(initialState.isLoading);

  // 🔁 Load user from localStorage on refresh
  const loadUserFromStorage = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        setToken(storedToken);

        const response = await api.get('/profile');
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  // ✅ LOGIN (real API call, ensures React update is complete)
  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      // Save token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Update axios defaults
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      loadUserFromStorage();
      // Update React state
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);

      // ✅ Wait for state to finish updating before resolving
      await new Promise((resolve) => setTimeout(resolve, 0));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed.');
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    delete api.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
