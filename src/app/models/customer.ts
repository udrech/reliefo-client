export interface Customer {
  id: number;
  lastName: string;
  firstName: string;
  address: string | null;
  city: string | null;
  zipCode: string | null;
  country: string | null;
  email: string | null;
  phone: string | null;
  mobile: string | null;
  socialSecurityNumber: string | null;
  healthInsuranceProvider: string | null;
  healthInsuranceId: string | null;
  createdAt: string;
  updatedAt: string;
}
