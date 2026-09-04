import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { petService } from '../services/petService';
import { CreatePetInput, UpdatePetInput } from '../types/pet';

export const usePets = (userId?: string) => {
  return useQuery({
    queryKey: ['pets', userId],
    queryFn: () => petService.getPets(userId),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
};

export const usePet = (id?: string) => {
  return useQuery({
    queryKey: ['pets', 'detail', id],
    queryFn: () => {
      if (!id) throw new Error('ID do pet não fornecido');
      return petService.getPetById(id);
    },
    enabled: Boolean(id),
  });
};

export const useAddPet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePetInput) => petService.createPet(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
};

export const useUpdatePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePetInput }) =>
      petService.updatePet(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      queryClient.invalidateQueries({ queryKey: ['pets', 'detail', variables.id] });
    },
  });
};

export const useDeletePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => petService.deletePet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
};
