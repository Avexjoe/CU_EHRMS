import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authApi, ApiUser } from '@/lib/api';

export type UserRole = 'admin' | 'doctor' | 'nurse' | 'lab_tech' | 'pharmacist' | 'receptionist' | 'cashier';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function toUser(api: ApiUser): User {
  return { id: String(api.id), name: api.name, email: api.email, role: api.role };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('ehr_token');
    if (token) {
      authApi.me()
        .then(apiUser => setUser(toUser(apiUser)))
        .catch(() => localStorage.removeItem('ehr_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const { token, user: apiUser } = await authApi.login(email, password);
      localStorage.setItem('ehr_token', token);
      setUser(toUser(apiUser));
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    localStorage.removeItem('ehr_token');
    setUser(null);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, darkMode, setDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

// Kept for backward compatibility — dashboards that import MOCK_USERS won't break
export const MOCK_USERS: User[] = [];
