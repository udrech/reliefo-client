import { Customer } from './customer';

// wird im Formular verwendet
export interface MedicalHistoryRecord {
  id: number;
  customerId: number;
  customer?: Customer;
  historyTimestamp: Date;
  historyType: string | null;
  note: string;
  createdAt: Date;
  updatedAt: Date;
}

// kommt vom API
export interface MedicalHistoryRecordRaw {
  id: number;
  customerId: number;
  customer?: Customer;
  historyTimestamp: string;
  historyType: string | null;
  note: string;
  createdAt: string;
  updatedAt: string;
}

// wird dem Service übergeben
export interface MedicalHistoryRecordPayload {
  customerId: number;
  historyTimestamp: Date;
  historyType: string | null;
  note: string;
}

// wird ans API gesendet
export interface MedicalHistoryRecordPayloadRaw {
  customerId: number;
  historyTimestamp: string;
  historyType: string | null;
  note: string;
}
