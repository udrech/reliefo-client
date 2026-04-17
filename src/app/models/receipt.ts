import { Customer } from "./customer";

export interface Receipt {
  id: number;
  customerId: number;
  customer: Customer;
  receiptTimestamp: string;
  file: string;
  data: string;
  createdAt: string;
  updatedAt: string;
}
