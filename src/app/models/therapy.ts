export interface Therapy {
  id: number;
  therapyId: number;
  name: string;
  nameOnBill: string;
  description: string;
  duration: number;
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
  description: string;
  duration: number;
  price: number;
  validFrom: string;
  createdAt: string;
  updatedAt: string;
}
