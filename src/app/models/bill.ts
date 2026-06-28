import { Appointment } from "./appointment";
import { Customer, CustomerRaw } from "./customer";

export interface Bill {
  id: number;
  customerId: number;
  customer: Customer;
  billNumber: number;
  filename: string;
  data: string; // JSON
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface BillRaw {
  id: number;
  customerId: number;
  customer: CustomerRaw;
  billNumber: number;
  filename: string;
  data: string; // JSON
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface BillPayload {
  customerId: number;
  appointments: Appointment[];
}
