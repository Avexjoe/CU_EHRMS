import React, { createContext, useContext, useState, useCallback } from 'react';

export type UserRole = 'admin' | 'doctor' | 'nurse' | 'lab_tech' | 'pharmacist' | 'receptionist' | 'cashier';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
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

const MOCK_USERS: User[] = [
  { id: '1', name: 'Dr. Admin', email: 'admin@hospital.edu', role: 'admin' },
  { id: '2', name: 'Dr. Sarah Chen', email: 'doctor@hospital.edu', role: 'doctor' },
  { id: '3', name: 'Nurse Emily Davis', email: 'nurse@hospital.edu', role: 'nurse' },
  { id: '4', name: 'James Wilson', email: 'labtech@hospital.edu', role: 'lab_tech' },
  { id: '5', name: 'Maria Garcia', email: 'pharmacist@hospital.edu', role: 'pharmacist' },
  { id: '6', name: 'Ana Rodriguez', email: 'receptionist@hospital.edu', role: 'receptionist' },
  { id: '7', name: 'Kwame Asante', email: 'cashier@hospital.edu', role: 'cashier' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    const found = MOCK_USERS.find(u => u.email === email);
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

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

export { MOCK_USERS };
