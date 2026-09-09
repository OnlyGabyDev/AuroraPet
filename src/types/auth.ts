export type UserRole = 'tutor' | 'veterinarian' | 'clinic_admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  photoURL?: string;
  createdAt?: string;
  role: UserRole;
  identifierType?: 'CPF' | 'CRMV' | 'CNPJ';
  identifierValue?: string;
  // Campos específicos de perfil
  crmv?: string;
  crmvUf?: string;
  specialty?: string;
  clinicId?: string;
  clinicName?: string;
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  isDemoUser: boolean;
}

