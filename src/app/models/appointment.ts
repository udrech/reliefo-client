import { Therapy, TherapyRaw } from './therapy';

// wird im Formular verwendet
export interface Appointment {
  id: number;
  customerId: number;
  therapyId: number;
  therapy: Therapy;
  appointmentTimestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

// kommt vom API
export interface AppointmentRaw {
  id: number;
  customerId: number;
  therapyId: number;
  therapy: TherapyRaw;
  appointmentTimestamp: string;
  createdAt: string;
  updatedAt: string;
}

// wird dem Service übergeben
export interface AppointmentPayload {
  customerId: number;
  therapyId: number;
  appointmentTimestamp: Date;
}

// wird ans API gesendet
export interface AppointmentPayloadRaw {
  customerId: number;
  therapyId: number;
  appointmentTimestamp: string;
}
