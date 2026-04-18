import { Customer } from "./customer";

export interface Bill {
  id: number;
  customerId: number;
  customer: Customer;
  billTimestamp: string;
  file: string;
  data: string;
  createdAt: string;
  updatedAt: string;
}
