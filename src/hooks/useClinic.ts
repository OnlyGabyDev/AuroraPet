import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clinicService } from '../services/clinicService';
import { planService } from '../services/planService';
import { requestService } from '../services/requestService';
import {
  CreateSpecialistInput,
  UpdateSpecialistInput,
  ClinicProfile,
} from '../types/specialist';
import { ConsultationReport } from '../types/appointment';
import { RequestStatus } from '../types/administrativeRequest';

export function useClinicProfile() {
  return useQuery({
    queryKey: ['clinic-profile'],
    queryFn: () => clinicService.getClinicProfile(),
  });
}

export function useUpdateClinicProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<ClinicProfile>) => clinicService.updateClinicProfile(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic-profile'] });
    },
  });
}

export function useSpecialists() {
  return useQuery({
    queryKey: ['specialists'],
    queryFn: () => clinicService.getSpecialists(),
  });
}

export const useClinicSpecialists = useSpecialists;

export function useCreateSpecialist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSpecialistInput) => clinicService.createSpecialist(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialists'] });
      queryClient.invalidateQueries({ queryKey: ['clinic-subscription'] });
    },
  });
}

export function useUpdateSpecialist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSpecialistInput }) =>
      clinicService.updateSpecialist(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialists'] });
    },
  });
}

export function useDeleteSpecialist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clinicService.deleteSpecialist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialists'] });
      queryClient.invalidateQueries({ queryKey: ['clinic-subscription'] });
    },
  });
}

export function useSubmitConsultationReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      appointmentId,
      report,
      reportData,
    }: {
      appointmentId: string;
      report?: Partial<ConsultationReport>;
      reportData?: Partial<ConsultationReport>;
    }) =>
      clinicService.submitConsultationReport(
        appointmentId,
        (report || reportData || {}) as Partial<ConsultationReport>
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

// Planos & Assinatura da Clínica (PLANO & ASSINATURA_CLINICA)
export function usePlans() {
  return useQuery({
    queryKey: ['plans'],
    queryFn: () => planService.getPlans(),
  });
}

export function useClinicSubscription(clinicId?: string) {
  return useQuery({
    queryKey: ['clinic-subscription', clinicId],
    queryFn: () => planService.getClinicSubscription(clinicId),
  });
}

export function useUpgradePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId: string) => planService.upgradePlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic-subscription'] });
    },
  });
}

// Solicitações Administrativas (SOLICITACAO_ADMINISTRATIVA)
export function useClinicRequests(clinicId?: string) {
  return useQuery({
    queryKey: ['clinic-requests', clinicId],
    queryFn: () => requestService.getClinicRequests(clinicId),
  });
}

export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      requestId,
      status,
      feedback,
      adminName,
    }: {
      requestId: string;
      status: RequestStatus;
      feedback?: string;
      adminName?: string;
    }) => requestService.updateRequestStatus(requestId, status, feedback, adminName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic-requests'] });
      queryClient.invalidateQueries({ queryKey: ['veterinarian-requests'] });
    },
  });
}