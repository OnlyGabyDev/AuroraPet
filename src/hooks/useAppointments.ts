import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '../services/appointmentService';
import { CreateAppointmentInput, UpdateAppointmentInput } from '../types/appointment';

export const useAppointments = (userId?: string) => {
  return useQuery({
    queryKey: ['appointments', userId],
    queryFn: () => appointmentService.getAppointments(userId),
    staleTime: 1000 * 60 * 2,
  });
};

export const useAppointment = (id?: string) => {
  return useQuery({
    queryKey: ['appointments', 'detail', id],
    queryFn: () => {
      if (!id) throw new Error('ID do agendamento não fornecido');
      return appointmentService.getAppointmentById(id);
    },
    enabled: Boolean(id),
  });
};

export const useAddAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAppointmentInput) =>
      appointmentService.createAppointment(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

export const useCreateAppointment = useAddAppointment;

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAppointmentInput }) =>
      appointmentService.updateAppointment(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({
        queryKey: ['appointments', 'detail', variables.id],
      });
    },
  });
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => appointmentService.deleteAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      appointmentService.updateAppointment(id, { status: 'cancelled' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};
