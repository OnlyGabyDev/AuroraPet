export type AuthorizationStatus = 'ACTIVE' | 'PENDING' | 'REVOKED' | 'EXPIRED';

export interface PetAccessAuthorization {
  id: string;
  petId: string;
  petName: string;
  tutorId: string;
  veterinarianId: string;
  veterinarianName: string;
  crmv: string;
  clinicId?: string;
  clinicName?: string;
  authorizedAt: string;
  expiresAt?: string;
  status: AuthorizationStatus;
  revocationReason?: string;
  revokedAt?: string;
}

export interface GrantAuthorizationInput {
  petId: string;
  petName: string;
  tutorId: string;
  veterinarianId: string;
  veterinarianName: string;
  crmv: string;
  clinicId?: string;
  clinicName?: string;
  expiresAt?: string;
}
