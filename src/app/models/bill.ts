import { Appointment } from "./appointment";
import { Customer, CustomerRaw } from "./customer";

export interface Bill {
  id: number;
  customerId: number;
  customer: Customer;
  customerBillNumber: string;
  file: string;
  data: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BillRaw {
  id: number;
  customerId: number;
  customer: CustomerRaw;
  customerBillNumber: string;
  file: string;
  data: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillPayload {
  customerId: number;
  appointments: Appointment[];
}
