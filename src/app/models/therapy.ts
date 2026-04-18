export interface Therapy {
  id: number;
  therapyId: number
  name: string;
  nameOnBill: string;
  description: string;
  duration: number;
  price: number;
  validFrom: Date;
  createdAt: string;
  updatedAt: string;
}
