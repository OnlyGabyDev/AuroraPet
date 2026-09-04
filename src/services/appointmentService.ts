import { apiFetch } from './api';
import { Appointment, CreateAppointmentInput, UpdateAppointmentInput } from '../types/appointment';

export const appointmentService = {
  /**
   * Consulta a lista de consultas/agendamentos do tutor via HTTP GET
   */
  async getAppointments(userId?: string): Promise<Appointment[]> {
    const queryParam = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    return apiFetch<Appointment[]>(`/appointments${queryParam}`);
  },

  /**
   * Consulta os dados de um agendamento específico pelo ID
   */
  async getAppointmentById(id: string): Promise<Appointment> {
    return apiFetch<Appointment>(`/appointments/${encodeURIComponent(id)}`);
  },

  /**
   * Cria um novo agendamento de consulta via HTTP POST
   */
  async createAppointment(input: CreateAppointmentInput): Promise<Appointment> {
    return apiFetch<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  /**
   * Atualiza status, data, horário ou observações via HTTP PUT
   */
  async updateAppointment(id: string, input: UpdateAppointmentInput): Promise<Appointment> {
    return apiFetch<Appointment>(`/appointments/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },

  /**
   * Cancela ou exclui um agendamento via HTTP DELETE
   */
  async deleteAppointment(id: string): Promise<{ message: string; id: string }> {
    return apiFetch<{ message: string; id: string }>(`/appointments/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },
};
