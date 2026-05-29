import { Injectable, inject, signal } from '@angular/core';

import { Appointment } from '@/models/appointment';
import { Bill } from '@/models/bill';
import { Customer } from '@/models/customer';
import { MedicalHistoryRecord } from '@/models/medicalhistoryrecord';
import { AppointmentService } from '@/services/appointment.service';
import { BillService } from '@/services/bill.service';
import { CustomerService } from '@/services/customer.service';
import { MedicalHistoryRecordService } from '@/services/medicalhistoryrecord';

@Injectable()
export class CustomerDetailStore {
  private readonly appointmentService = inject(AppointmentService);
  private readonly billService = inject(BillService);
  private readonly customerService = inject(CustomerService);
  private readonly medicalHistoryRecordService = inject(MedicalHistoryRecordService);

  private readonly _customerId = signal<number | null>(null);
  private readonly _customer = signal<Customer | null>(null);
  private readonly _appointments = signal<Appointment[]>([]);
  private readonly _bills = signal<Bill[]>([]);
  private readonly _medicalHistoryRecords = signal<MedicalHistoryRecord[]>([]);

  readonly customerId = this._customerId.asReadonly();
  readonly customer = this._customer.asReadonly();
  readonly appointments = this._appointments.asReadonly();
  readonly bills = this._bills.asReadonly();
  readonly medicalHistoryRecords = this._medicalHistoryRecords.asReadonly();

  load(customerId: number): void {
    this._customerId.set(customerId);
    this.loadCustomer();
    this.loadAppointments();
    this.loadBills();
    this.loadMedicalHistoryRecords();
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

  loadMedicalHistoryRecords(): void {
    const id = this._customerId();
    this.medicalHistoryRecordService.getByCustomerId(id!).subscribe(
      records => this._medicalHistoryRecords.set(records)
    );
  }
}
