import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string, rememberMe?: boolean) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  updateProfile: (name: string, email: string) => Promise<void>;
  changePassword: (currentPass: string, newPass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check the current session on startup.
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const currentUser = authService.getCurrentUser();
        if (mounted) {
          setUser(currentUser);
        }
      } catch {
        setUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    init();
    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, pass: string, _rememberMe?: boolean) => {
    const res = await authService.login(email, pass);
    setUser(res.user);
  }, []);

  const register = useCallback(async (name: string, email: string, pass: string) => {
    const res = await authService.register(name, email, pass);
    setUser(res.user);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (name: string, email: string) => {
    if (!user) throw new Error('Not authenticated');
    const updated = await authService.updateProfile(user.id, name, email);
    setUser(updated);
  }, [user]);

  const changePassword = useCallback(async (currentPass: string, newPass: string) => {
    if (!user) throw new Error('Not authenticated');
    await authService.changePassword(user.id, currentPass, newPass);
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
