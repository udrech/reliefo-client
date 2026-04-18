import { Customer } from "./customer";

export interface Bill {
  id: number;
  customerId: number;
  customer: Customer;
  file: string;
  data: string;
  createdAt: Date;
  updatedAt: Date;
}
