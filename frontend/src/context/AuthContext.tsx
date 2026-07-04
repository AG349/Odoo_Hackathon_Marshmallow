import React, { createContext, useContext, useState } from 'react';
import type { User, UserRole } from '../types';
import { mockEmployees } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const isAuthenticated = !!user;

  const login = async (email: string, role: UserRole): Promise<boolean> => {
    // Simulated network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Find the corresponding mock employee matching this role or general mock
    const employee = mockEmployees.find(e => 
      role === 'admin' ? e.id === 'EMP002' : e.id === 'EMP001'
    ) || mockEmployees[0];

    const loggedUser: User = {
      id: employee.id,
      email: email || employee.email,
      name: employee.name,
      role: role,
      avatar: employee.avatar,
      employeeId: employee.id
    };

    setUser(loggedUser);
    localStorage.setItem('auth_user', JSON.stringify(loggedUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const switchRole = () => {
    if (!user) return;
    const nextRole: UserRole = user.role === 'admin' ? 'employee' : 'admin';
    const nextEmployee = mockEmployees.find(e => 
      nextRole === 'admin' ? e.id === 'EMP002' : e.id === 'EMP001'
    ) || mockEmployees[0];

    const nextUser: User = {
      id: nextEmployee.id,
      email: nextEmployee.email,
      name: nextEmployee.name,
      role: nextRole,
      avatar: nextEmployee.avatar,
      employeeId: nextEmployee.id
    };

    setUser(nextUser);
    localStorage.setItem('auth_user', JSON.stringify(nextUser));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
