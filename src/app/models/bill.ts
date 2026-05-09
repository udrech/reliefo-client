import { Appointment } from "./appointment";
import { Customer, CustomerRaw } from "./customer";

export interface Bill {
  id: number;
  customerId: number;
  customer: Customer;
  file: string;
  data: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface BillRaw {
  id: number;
  customerId: number;
  customer: CustomerRaw;
  file: string;
  data: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface BillPayload {
  customerId: number;
  appointments: Appointment[];
}
