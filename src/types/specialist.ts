export interface Specialist {
  id: string;
  name: string;
  role?: string;
  specialty: string;
  crmv: string;
  bio: string;
  photoUrl: string;
  availableDays: string[];
  availableHours?: string[];
  email?: string;
  phone?: string;
  active?: boolean;
}

export type CreateSpecialistInput = Omit<Specialist, 'id'>;
export type UpdateSpecialistInput = Partial<CreateSpecialistInput>;

export interface ClinicService {
  id: string;
  code?: string;
  title?: string;
  name?: string;
  description: string;
  duration?: string;
  durationMinutes?: number;
  price?: string | number;
  category?: string;
  iconName?: string;
}

export type ClinicMode = 'multi_vet' | 'solo_vet';

export interface ClinicProfile {
  id: string;
  name: string;
  tradeName: string;
  cnpj?: string;
  mode: ClinicMode;
  address: string;
  phone: string;
  emergencyPhone: string;
  openingHours: string;
  description: string;
  soloVetId?: string; // se for solo_vet, aponta para o ID do veterinário titular
}

