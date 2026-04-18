export interface Therapy {
  id: number;
  therapyId: number;
  name: string;
  nameOnBill: string;
  description: string | null;
  duration: number | null; // in minutes
  price: number;
  validFrom: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TherapyRaw {
  id: number;
  therapyId: number;
  name: string;
  nameOnBill: string;
  description: string | null;
  duration: number | null; // in minutes
  price: number;
  validFrom: string;
  createdAt: string;
  updatedAt: string;
}
