import { Injectable, inject, signal } from '@angular/core';

import { Appointment } from '@/models/appointment';
import { Bill } from '@/models/bill';
import { Customer } from '@/models/customer';
import { AppointmentService } from '@/services/appointment.service';
import { BillService } from '@/services/bill.service';
import { CustomerService } from '@/services/customer.service';

@Injectable()
export class CustomerDetailStore {
  private readonly appointmentService = inject(AppointmentService);
  private readonly billService = inject(BillService);
  private readonly customerService = inject(CustomerService);

  private readonly _customerId = signal<number | null>(null);
  private readonly _customer = signal<Customer | null>(null);
  private readonly _appointments = signal<Appointment[]>([]);
  private readonly _bills = signal<Bill[]>([]);

  readonly customerId = this._customerId.asReadonly();
  readonly customer = this._customer.asReadonly();
  readonly appointments = this._appointments.asReadonly();
  readonly bills = this._bills.asReadonly();

  load(customerId: number): void {
    this._customerId.set(customerId);
    this.loadCustomer();
    this.loadAppointments();
    this.loadBills();
  }

  loadCustomer(): void {
    const id = this._customerId();
    this.customerService.getById(id!).subscribe(
      customer => this._customer.set(customer)
    );
  }

  loadAppointments(): void {
    const id = this._customerId();
    this.appointmentService.getByCustomerId(id!).subscribe(
      appointments => this._appointments.set(appointments)
    );
  }

  loadBills(): void {
    const id = this._customerId();
    this.billService.getByCustomerId(id!).subscribe(
      bills => this._bills.set(bills)
    );
  }
}
