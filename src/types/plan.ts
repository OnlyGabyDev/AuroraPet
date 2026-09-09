export interface Plan {
  id: string;
  code: 'basic' | 'pro' | 'enterprise';
  name: string;
  description: string;
  monthlyPrice: number;
  maxVeterinarians: number;
  maxAdmins: number;
  maxPatients: number;
  features: string[];
  recommended?: boolean;
}

export interface ClinicSubscription {
  id: string;
  clinicId: string;
  clinicName: string;
  planId: string;
  planName: string;
  planCode: 'basic' | 'pro' | 'enterprise';
  status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'TRIAL';
  startDate: string;
  renewalDate: string;
  // Métricas de uso em relação aos limites do plano
  limits: {
    maxVeterinarians: number;
    usedVeterinarians: number;
    maxAdmins: number;
    usedAdmins: number;
    maxPatients: number;
    usedPatients: number;
  };
}
