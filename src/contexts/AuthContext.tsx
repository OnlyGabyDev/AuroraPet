import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserProfile } from '../types/auth';
import { authService } from '../services/authService';
import { isFirebaseConfigured } from '../services/firebase';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isDemoUser: boolean;
  isFirebaseActive: boolean;
  login: (email: string, pass: string) => Promise<UserProfile>;
  register: (name: string, email: string, pass: string) => Promise<UserProfile>;
  loginWithDemo: () => Promise<UserProfile>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const logged = await authService.loginWithEmail(email, pass);
      setUser(logged);
      return logged;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    setLoading(true);
    try {
      const created = await authService.registerWithEmail(name, email, pass);
      setUser(created);
      return created;
    } finally {
      setLoading(false);
    }
  };

  const loginWithDemo = async () => {
    setLoading(true);
    try {
      const demo = await authService.loginWithDemo();
      setUser(demo);
      return demo;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await authService.sendPasswordReset(email);
  };

  const isDemoUser = !isFirebaseConfigured || (user?.uid === 'demo-tutor-123');

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemoUser,
        isFirebaseActive: isFirebaseConfigured,
        login,
        register,
        loginWithDemo,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};
