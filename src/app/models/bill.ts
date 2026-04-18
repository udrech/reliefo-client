import { Customer } from "./customer";

export interface Bill {
  id: number;
  customerId: number;
  customer: Customer;
  billTimestamp: Date;
  file: string;
  data: string;
  createdAt: Date;
  updatedAt: Date;
}
