import { Customer } from './customer';
import { Therapy } from './therapy';

export interface Appointment {
  id: number;
  customerId: number;
  customer: Customer;
  therapyId: number;
  therapy: Therapy;
  appointmentTimestamp: string;
  createdAt: string;
  updatedAt: string;
}
