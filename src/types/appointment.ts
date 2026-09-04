export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  userId: string;
  petId: string;
  petName: string;
  specialistId: string;
  specialistName: string;
  serviceId?: string;
  serviceName: string;
  date: string;       // YYYY-MM-DD
  time: string;       // HH:mm
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt?: string;
}

export type CreateAppointmentInput = Omit<Appointment, 'id' | 'createdAt' | 'status' | 'updatedAt'>;

export type UpdateAppointmentInput = Partial<CreateAppointmentInput> & {
  status?: AppointmentStatus;
};
