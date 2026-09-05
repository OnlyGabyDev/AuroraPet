import { apiFetch } from './api';
import {
  Specialist,
  ClinicService,
  CreateSpecialistInput,
  UpdateSpecialistInput,
  ClinicProfile,
} from '../types/specialist';
import { Appointment, ConsultationReport } from '../types/appointment';

export const clinicService = {
  /**
   * Consulta os dados cadastrais e operacionais da clínica
   */
  async getClinicProfile(): Promise<ClinicProfile> {
    return apiFetch<ClinicProfile>('/clinic');
  },

  /**
   * Atualiza os dados ou modo de operação da clínica
   */
  async updateClinicProfile(input: Partial<ClinicProfile>): Promise<ClinicProfile> {
    return apiFetch<ClinicProfile>('/clinic', {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },

  /**
   * Consulta a lista de especialistas da clínica via HTTP GET
   */
  async getSpecialists(): Promise<Specialist[]> {
    return apiFetch<Specialist[]>('/specialists');
  },

  /**
   * Consulta um especialista específico pelo ID
   */
  async getSpecialistById(id: string): Promise<Specialist> {
    return apiFetch<Specialist>(`/specialists/${encodeURIComponent(id)}`);
  },

  /**
   * Cadastra um novo veterinário / especialista na clínica
   */
  async createSpecialist(input: CreateSpecialistInput): Promise<Specialist> {
    return apiFetch<Specialist>('/specialists', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  /**
   * Atualiza dados de um veterinário existente
   */
  async updateSpecialist(id: string, input: UpdateSpecialistInput): Promise<Specialist> {
    return apiFetch<Specialist>(`/specialists/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },

  /**
   * Remove um veterinário da equipe da clínica
   */
  async deleteSpecialist(id: string): Promise<{ message: string; id: string }> {
    return apiFetch<{ message: string; id: string }>(`/specialists/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  /**
   * Consulta a lista de serviços oferecidos pela clínica via HTTP GET
   */
  async getServices(): Promise<ClinicService[]> {
    return apiFetch<ClinicService[]>('/services');
  },

  /**
   * Emite o laudo/relatório clínico e conclui o atendimento da consulta
   */
  async submitConsultationReport(
    appointmentId: string,
    reportData: Partial<ConsultationReport>
  ): Promise<Appointment> {
    return apiFetch<Appointment>(`/appointments/${encodeURIComponent(appointmentId)}/report`, {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  },

  /**
   * Consulta o relatório clínico de uma consulta concluída
   */
  async getConsultationReport(appointmentId: string): Promise<ConsultationReport> {
    return apiFetch<ConsultationReport>(`/appointments/${encodeURIComponent(appointmentId)}/report`);
  },
};

