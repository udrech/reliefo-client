export interface AppointmentsPerMonthStat {
  month: number;
  appointmentCount: number;
}

export interface AppointmentsPerCustomerStat {
  customerId: number;
  firstName: string;
  lastName: string;
  appointmentCount: number;
}

export interface IncomePerMonthStat {
  month: number;
  income: number;
}
