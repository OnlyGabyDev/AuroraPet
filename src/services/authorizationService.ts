import { apiFetch } from './api';
import { PetAccessAuthorization, GrantAuthorizationInput } from '../types/authorization';

export const authorizationService = {
  /**
   * Lista todas as autorizações de acesso de um pet específico
   */
  async getAuthorizationsByPet(petId: string): Promise<PetAccessAuthorization[]> {
    return apiFetch<PetAccessAuthorization[]>(`/authorizations?petId=${encodeURIComponent(petId)}`);
  },

  /**
   * Lista todas as autorizações concedidas a um veterinário específico
   */
  async getAuthorizationsByVet(vetId: string): Promise<PetAccessAuthorization[]> {
    return apiFetch<PetAccessAuthorization[]>(`/authorizations?vetId=${encodeURIComponent(vetId)}`);
  },

  /**
   * Concede acesso de um veterinário ao prontuário de um pet
   */
  async grantAuthorization(input: GrantAuthorizationInput): Promise<PetAccessAuthorization> {
    const newAuth = {
      petId: input.petId,
      petName: input.petName,
      tutorId: input.tutorId,
      veterinarianId: input.veterinarianId,
      veterinarianName: input.veterinarianName,
      crmv: input.crmv,
      clinicId: input.clinicId,
      clinicName: input.clinicName,
      expiresAt: input.expiresAt,
    };

    return apiFetch<PetAccessAuthorization>('/authorizations', {
      method: 'POST',
      body: JSON.stringify(newAuth),
    });
  },

  /**
   * Revoga imediatamente a autorização de um veterinário (conforme modelo 3FN)
   */
  async revokeAuthorization(authId: string, reason?: string): Promise<PetAccessAuthorization> {
    return apiFetch<PetAccessAuthorization>(
      `/authorizations/${encodeURIComponent(authId)}/revoke`,
      {
        method: 'PUT',
        body: JSON.stringify({ reason: reason || 'Revogado pelo tutor.' }),
      }
    );
  },

  /**
   * Valida se o veterinário tem acesso ativo e dentro da data de expiração ao pet
   */
  async checkVetAccess(petId: string, vetId: string): Promise<boolean> {
    try {
      const list = await apiFetch<PetAccessAuthorization[]>(
        `/authorizations?petId=${encodeURIComponent(petId)}&vetId=${encodeURIComponent(vetId)}`
      );
      const today = new Date().toISOString().split('T')[0];
      return list.some(
        (a) =>
          a.status === 'ACTIVE' &&
          (!a.expiresAt || a.expiresAt >= today)
      );
    } catch {
      return false;
    }
  },
};
