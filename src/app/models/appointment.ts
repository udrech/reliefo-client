import { Therapy, TherapyRaw } from './therapy';

export interface Appointment {
  id: number;
  customerId: number;
  therapyId: number;
  therapy: Therapy;
  appointmentTimestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentRaw {
  id: number;
  customerId: number;
  therapyId: number;
  therapy: TherapyRaw;
  appointmentTimestamp: string;
  createdAt: string;
  updatedAt: string;
}
