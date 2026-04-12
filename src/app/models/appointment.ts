import { Therapy } from './therapy';

export interface Appointment {
  id: number;
  customerId: number;
  therapyId: number;
  therapy: Therapy;
  appointmentTimestamp: string;
  createdAt: string;
  updatedAt: string;
}
