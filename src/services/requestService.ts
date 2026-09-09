import {
  AdministrativeRequest,
  CreateAdministrativeRequestInput,
  RequestStatus,
} from '../types/administrativeRequest';
import { apiFetch } from './api';

export const requestService = {
  /**
   * Lista todas as solicitações administrativas recebidas pela clínica
   */
  async getClinicRequests(clinicId?: string): Promise<AdministrativeRequest[]> {
    return apiFetch<AdministrativeRequest[]>(
      `/requests${clinicId ? `?clinicId=${encodeURIComponent(clinicId)}` : ''}`
    );
  },

  /**
   * Lista as solicitações enviadas por um médico veterinário
   */
  async getVeterinarianRequests(veterinarianId: string): Promise<AdministrativeRequest[]> {
    return apiFetch<AdministrativeRequest[]>(
      `/requests?veterinarianId=${encodeURIComponent(veterinarianId)}`
    );
  },

  /**
   * Envia uma nova solicitação administrativa do veterinário para a clínica
   */
  async createRequest(input: CreateAdministrativeRequestInput): Promise<AdministrativeRequest> {
    const payload = {
      veterinarianId: input.veterinarianId,
      veterinarianName: input.veterinarianName,
      crmv: input.crmv,
      clinicId: input.clinicId,
      clinicName: input.clinicName,
      title: input.title.trim(),
      description: input.description.trim(),
      priority: input.priority,
    };

    return apiFetch<AdministrativeRequest>('/requests', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Atualiza o status de uma solicitação (Aprovar, Recusar, Colocar em análise) com parecer
   */
  async updateRequestStatus(
    requestId: string,
    status: RequestStatus,
    feedback?: string,
    adminName?: string
  ): Promise<AdministrativeRequest> {
    const patch = {
      status,
      adminFeedback: feedback,
      resolvedAt: ['APPROVED', 'REJECTED', 'FINISHED'].includes(status)
        ? new Date().toISOString().split('T')[0]
        : undefined,
      resolvedByAdminName: adminName,
    };

    return apiFetch<AdministrativeRequest>(
      `/requests/${encodeURIComponent(requestId)}`,
      {
        method: 'PUT',
        body: JSON.stringify(patch),
      }
    );
  },
};
