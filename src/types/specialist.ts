export interface Specialist {
  id: string;
  name: string;
  role?: string;
  specialty: string;
  crmv: string;
  bio: string;
  photoUrl: string;
  availableDays: string[];
  availableHours?: string[];
}

export interface ClinicService {
  id: string;
  code?: string;
  title?: string;
  name?: string;
  description: string;
  duration?: string;
  durationMinutes?: number;
  price?: string | number;
  category?: string;
  iconName?: string;
}
