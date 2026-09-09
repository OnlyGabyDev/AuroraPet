import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, UserRole } from '../types/auth';
import { authService } from '../services/authService';
import { isFirebaseConfigured } from '../services/firebase';

const ACTIVE_ROLE_KEY = '@clyvo_active_user_role';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  loading: boolean;
  isDemoUser: boolean;
  isFirebaseActive: boolean;
  login: (email: string, pass: string) => Promise<UserProfile>;
  register: (name: string, email: string, pass: string) => Promise<UserProfile>;
  loginWithDemo: () => Promise<UserProfile>;
  switchRole: (role: UserRole) => Promise<UserProfile>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Carrega papel salvo ou padrão do usuário
    const initAuth = async () => {
      try {
        const savedRole = (await AsyncStorage.getItem(ACTIVE_ROLE_KEY)) as UserRole | null;
        if (savedRole) {
          const userWithRole = await authService.loginWithDemoRole(savedRole);
          setUser(userWithRole);
          setLoading(false);
          return;
        }
      } catch {
        // segue para listener padrão
      }

      const unsubscribe = authService.onAuthStateChange((currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
      return () => unsubscribe();
    };

    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const logged = await authService.loginWithEmail(email, pass);
      setUser(logged);
      await AsyncStorage.setItem(ACTIVE_ROLE_KEY, logged.role || 'tutor');
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
      await AsyncStorage.setItem(ACTIVE_ROLE_KEY, 'tutor');
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
      await AsyncStorage.setItem(ACTIVE_ROLE_KEY, 'tutor');
      return demo;
    } finally {
      setLoading(false);
    }
  };

  const switchRole = async (targetRole: UserRole) => {
    setLoading(true);
    try {
      const switched = await authService.loginWithDemoRole(targetRole);
      setUser(switched);
      await AsyncStorage.setItem(ACTIVE_ROLE_KEY, targetRole);
      return switched;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      await AsyncStorage.removeItem(ACTIVE_ROLE_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await authService.sendPasswordReset(email);
  };

  const role: UserRole = user?.role || 'tutor';
  const isDemoUser = !isFirebaseConfigured || Boolean(user?.uid.startsWith('demo-'));

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        isDemoUser,
        isFirebaseActive: isFirebaseConfigured,
        login,
        register,
        loginWithDemo,
        switchRole,
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
