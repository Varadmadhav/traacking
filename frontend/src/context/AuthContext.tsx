import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string, startDate?: string, examDate?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUserTargets: (targets: Partial<User>) => Promise<boolean>;
  reseedUserPlan: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('winter_arc_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('winter_arc_token'));
  const [isLoading, setIsLoading] = useState<boolean>(!user && !!token);

  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem('winter_arc_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('winter_arc_user', JSON.stringify(res.data.user));
          }
        } catch (err: any) {
          console.error('Auth verification notice:', err?.message || err);
          // Only clear session if server explicitly returned 401 Unauthorized
          if (err?.response && err?.response?.status === 401) {
            logout();
          }
        }
      }
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('winter_arc_token', res.data.token);
        localStorage.setItem('winter_arc_user', JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Invalid email or password',
      };
    }
  };

  const register = async (name: string, email: string, password: string, startDate?: string, examDate?: string) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, startDate, examDate });
      if (res.data.success) {
        localStorage.setItem('winter_arc_token', res.data.token);
        localStorage.setItem('winter_arc_user', JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, message: res.data.message || 'Registration failed' };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Error creating account',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('winter_arc_token');
    localStorage.removeItem('winter_arc_user');
    setToken(null);
    setUser(null);
  };

  const updateUserTargets = async (targets: Partial<User>) => {
    try {
      const res = await api.put('/auth/profile', targets);
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('winter_arc_user', JSON.stringify(res.data.user));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to update targets:', err);
      return false;
    }
  };

  const reseedUserPlan = async () => {
    try {
      const res = await api.post('/auth/reseed');
      return res.data.success;
    } catch (err) {
      console.error('Failed to reseed plan:', err);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token || !!user,
        isLoading,
        login,
        register,
        logout,
        updateUserTargets,
        reseedUserPlan,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
