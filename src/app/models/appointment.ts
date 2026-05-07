import { Customer } from './customer';
import { Therapy, TherapyRaw } from './therapy';

// wird im Formular verwendet
export interface Appointment {
  id: number;
  customerId: number;
  customer?: Customer;
  therapyId: number;
  therapy?: Therapy;
  billId?: number | null;
  appointmentTimestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

// kommt vom API
export interface AppointmentRaw {
  id: number;
  customerId: number;
  customer?: Customer;
  therapyId: number;
  therapy?: TherapyRaw;
  billId?: number | null;
  appointmentTimestamp: string;
  createdAt: string;
  updatedAt: string;
}

// wird dem Service übergeben
export interface AppointmentPayload {
  customerId: number;
  therapyId: number;
  billId?: number | null;
  appointmentTimestamp: Date;
}

// wird ans API gesendet
export interface AppointmentPayloadRaw {
  customerId: number;
  therapyId: number;
  billId?: number | null;
  appointmentTimestamp: string;
}
