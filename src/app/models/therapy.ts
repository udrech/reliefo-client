export interface Therapy {
  id: number;
  name: string;
  nameOnBill: string;
  description: string | null;
  duration: number | null; // in minutes
  price: number;
  validFrom: Date;
  validTo: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TherapyRaw {
  id: number;
  name: string;
  nameOnBill: string;
  description: string | null;
  duration: number | null; // in minutes
  price: number;
  validFrom: string;
  validTo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TherapyPayload {
  name: string;
  nameOnBill: string;
  description: string | null;
  duration: number | null; // in minutes
  price: number;
  validFrom: Date;
  validTo: Date | null;
}


export interface TherapyPayloadRaw {
  name: string;
  nameOnBill: string;
  description: string | null;
  duration: number | null; // in minutes
  price: number;
  validFrom: string;
  validTo: string | null;
}
