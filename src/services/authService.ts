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
import { UserProfile } from '../types/auth';
import { DEMO_USER } from './mockData';

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
        };
      } catch (err) {
        throw new Error(formatAuthError(err));
      }
    }

    // Modo Demonstração
    const demoUser: UserProfile = {
      ...DEMO_USER,
      email,
      displayName: email.split('@')[0],
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_AUTH_KEY, JSON.stringify(demoUser));
    }
    return demoUser;
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
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_AUTH_KEY, JSON.stringify(demoUser));
    }
    return demoUser;
  },

  async loginWithDemo(): Promise<UserProfile> {
    if (typeof window !== 'undefined') {
      localStorage.setItem(DEMO_AUTH_KEY, JSON.stringify(DEMO_USER));
    }
    return DEMO_USER;
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

  onAuthStateChange(callback: (user: UserProfile | null) => void): () => void {
    if (isFirebaseConfigured && auth) {
      return onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          callback({
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Tutor',
            photoURL: fbUser.photoURL || undefined,
          });
        } else {
          callback(null);
        }
      });
    }

    // Modo Demonstração
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(DEMO_AUTH_KEY);
      if (raw) {
        try {
          callback(JSON.parse(raw));
        } catch {
          callback(null);
        }
      } else {
        callback(null);
      }
    } else {
      callback(null);
    }

    return () => {};
  },
};
