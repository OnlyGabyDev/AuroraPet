import { apiFetch } from './api';
import { Pet, CreatePetInput, UpdatePetInput } from '../types/pet';

export const petService = {
  /**
   * Consulta a lista de pets do tutor diretamente na API HTTP
   */
  async getPets(userId?: string): Promise<Pet[]> {
    const queryParam = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    return apiFetch<Pet[]>(`/pets${queryParam}`);
  },

  /**
   * Consulta um pet específico pelo ID
   */
  async getPetById(id: string): Promise<Pet> {
    return apiFetch<Pet>(`/pets/${encodeURIComponent(id)}`);
  },

  /**
   * Cadastra um novo pet via HTTP POST
   */
  async createPet(input: CreatePetInput): Promise<Pet> {
    return apiFetch<Pet>('/pets', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  /**
   * Atualiza dados de um pet existente via HTTP PUT
   */
  async updatePet(id: string, input: UpdatePetInput): Promise<Pet> {
    return apiFetch<Pet>(`/pets/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },

  /**
   * Exclui um pet via HTTP DELETE
   */
  async deletePet(id: string): Promise<{ message: string; id: string }> {
    return apiFetch<{ message: string; id: string }>(`/pets/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },
};
