import { useQuery } from '@tanstack/react-query';
import { clinicService } from '../services/clinicService';

export const useSpecialists = () => {
  return useQuery({
    queryKey: ['specialists'],
    queryFn: () => clinicService.getSpecialists(),
    staleTime: 1000 * 60 * 15,
  });
};

export const useClinicServices = () => {
  return useQuery({
    queryKey: ['clinicServices'],
    queryFn: () => clinicService.getServices(),
    staleTime: 1000 * 60 * 15,
  });
};
