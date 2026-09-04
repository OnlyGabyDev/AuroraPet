import { apiFetch } from './api';
import { Specialist, ClinicService } from '../types/specialist';

export const clinicService = {
  /**
   * Consulta a lista de especialistas da clínica via HTTP GET
   */
  async getSpecialists(): Promise<Specialist[]> {
    return apiFetch<Specialist[]>('/specialists');
  },

  /**
   * Consulta a lista de serviços oferecidos pela clínica via HTTP GET
   */
  async getServices(): Promise<ClinicService[]> {
    return apiFetch<ClinicService[]>('/services');
  },
};
