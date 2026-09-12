import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase';
import { UserProfile, UserRole } from '../types/auth';
import {
  DEMO_USER,
  DEMO_TUTOR_USER,
  DEMO_VET_USER,
  DEMO_CLINIC_ADMIN_USER,
} from './mockData';
import { apiLogin } from './api';


const DEMO_AUTH_KEY = 'clyvo_demo_current_user';

export function formatAuthError(error: any): string {
  const code = error?.code || '';
  switch (code) {
    case 'auth/invalid-email':
      return 'O formato do e-mail digitado é inválido.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-mail ou senha incorretos.';
    case 'auth/email-already-in-use':
      return 'Este e-mail já está cadastrado em outra conta.';
    case 'auth/weak-password':
      return 'A senha deve conter no mínimo 6 caracteres.';
    case 'auth/too-many-requests':
      return 'Acesso temporariamente bloqueado por excesso de tentativas. Tente novamente em alguns minutos.';
    case 'auth/network-request-failed':
      return 'Falha na conexão de rede. Verifique sua internet.';
    default:
      return error?.message || 'Ocorreu um erro no processo de autenticação.';
  }
}

export const authService = {
  async loginWithEmail(email: string, password: string): Promise<UserProfile> {
    if (isFirebaseConfigured && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        return {
          uid: cred.user.uid,
          email: cred.user.email || '',
          displayName: cred.user.displayName || email.split('@')[0],
          photoURL: cred.user.photoURL || undefined,
          role: 'tutor',
          identifierType: 'CPF',
        };
      } catch (err) {
        throw new Error(formatAuthError(err));
      }
    }

    // Real API fallback: use apiLogin; if fails, fall back to demo mode
    try {
      const apiUser = await apiLogin(email, password);
      // Persist auth key for consistency
      if (typeof window !== 'undefined') {
        localStorage.setItem(DEMO_AUTH_KEY, JSON.stringify(apiUser));
      }
      return apiUser;
    } catch (err) {
      // If API call fails, fallback to demo user
      const demoUser: UserProfile = {
        ...DEMO_USER,
        email,
        displayName: email.split('@')[0],
        role: 'tutor',
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(DEMO_AUTH_KEY, JSON.stringify(demoUser));
      }
      return demoUser;
    }
  },

  async registerWithEmail(name: string, email: string, password: string): Promise<UserProfile> {
    if (isFirebaseConfigured && auth) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
        return {
          uid: cred.user.uid,
          email: cred.user.email || '',
          displayName: name,
          role: 'tutor',
          identifierType: 'CPF',
        };
      } catch (err) {
        throw new Error(formatAuthError(err));
      }
    }

    // Modo Demonstração
    const demoUser: UserProfile = {
      uid: 'user-' + Date.now(),
      email,
      displayName: name,
      createdAt: new Date().toISOString().split('T')[0],
      role: 'tutor',
      identifierType: 'CPF',
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_AUTH_KEY, JSON.stringify(demoUser));
    }
    return demoUser;
  },

  async loginWithDemo(): Promise<UserProfile> {
    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_AUTH_KEY, JSON.stringify(DEMO_TUTOR_USER));
    }
    return DEMO_TUTOR_USER;
  },

  async loginWithDemoRole(role: UserRole): Promise<UserProfile> {
    let targetUser: UserProfile;
    switch (role) {
      case 'veterinarian':
        targetUser = DEMO_VET_USER;
        break;
      case 'clinic_admin':
        targetUser = DEMO_CLINIC_ADMIN_USER;
        break;
      case 'tutor':
      default:
        targetUser = DEMO_TUTOR_USER;
        break;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_AUTH_KEY, JSON.stringify(targetUser));
    }
    return targetUser;
  },

  async logout(): Promise<void> {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DEMO_AUTH_KEY);
    }
  },

  async sendPasswordReset(email: string): Promise<void> {
    if (isFirebaseConfigured && auth) {
      try {
        await sendPasswordResetEmail(auth, email);
        return;
      } catch (err) {
        throw new Error(formatAuthError(err));
      }
    }
    // Modo demo
    console.info('[Auth] Email de recuperação simulado enviado para:', email);
  },

  onAuthStateChange(callback: (user: UserProfile | null) => void) {
    if (isFirebaseConfigured && auth) {
      return onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          callback({
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Usuário',
            phoneNumber: fbUser.phoneNumber || undefined,
            photoURL: fbUser.photoURL || undefined,
            role: 'tutor',
            identifierType: 'CPF',
          });
        } else {
          callback(null);
        }
      });
    }

    // Modo Demonstração: verifica se há sessão salva explicitamente pelo usuário.
    // NÃO faz login automático — retorna null para forçar a tela de login.
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(DEMO_AUTH_KEY);
      if (stored) {
        try {
          callback(JSON.parse(stored));
          return () => {};
        } catch {
          // sessão corrompida, ignora
        }
      }
    }

    // Sem sessão salva → usuário não autenticado
    callback(null);
    return () => {};
  },
};
