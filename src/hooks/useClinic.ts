import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clinicService } from '../services/clinicService';
import {
  ClinicProfile,
  CreateSpecialistInput,
  UpdateSpecialistInput,
} from '../types/specialist';
import { ConsultationReport } from '../types/appointment';

export const useClinicProfile = () => {
  return useQuery({
    queryKey: ['clinicProfile'],
    queryFn: () => clinicService.getClinicProfile(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateClinicProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ClinicProfile>) =>
      clinicService.updateClinicProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinicProfile'] });
    },
  });
};

export const useClinicSpecialists = () => {
  return useQuery({
    queryKey: ['specialists'],
    queryFn: () => clinicService.getSpecialists(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateSpecialist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSpecialistInput) =>
      clinicService.createSpecialist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialists'] });
    },
  });
};

export const useUpdateSpecialist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSpecialistInput }) =>
      clinicService.updateSpecialist(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialists'] });
    },
  });
};

export const useDeleteSpecialist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clinicService.deleteSpecialist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialists'] });
    },
  });
};

export const useSubmitConsultationReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      appointmentId,
      report,
    }: {
      appointmentId: string;
      report: Partial<ConsultationReport>;
    }) => clinicService.submitConsultationReport(appointmentId, report),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({
        queryKey: ['appointments', 'detail', variables.appointmentId],
      });
      queryClient.invalidateQueries({
        queryKey: ['appointments', 'report', variables.appointmentId],
      });
    },
  });
};

export const useConsultationReport = (appointmentId?: string) => {
  return useQuery({
    queryKey: ['appointments', 'report', appointmentId],
    queryFn: () => {
      if (!appointmentId) throw new Error('ID da consulta não fornecido');
      return clinicService.getConsultationReport(appointmentId);
    },
    enabled: Boolean(appointmentId),
  });
};
