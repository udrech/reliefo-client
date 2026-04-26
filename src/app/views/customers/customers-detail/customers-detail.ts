import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { TabsModule } from 'primeng/tabs';

import { AppointmentService } from '@/services/appointment.service';
import { BillService } from '@/services/bill.service';
import { CustomerService } from '@/services/customer.service';

import { AppointmentsList } from '@/views/customers/appointments-list/appointments-list';
import { BillsList } from '@/views/customers/bills-list/bills-list';

@Component({
  selector: 'app-customers-detail',
  imports: [
    AppointmentsList,
    BillsList,
    DatePipe,
    TabsModule,
  ],
  templateUrl: './customers-detail.html',
  styleUrl: './customers-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly customerService = inject(CustomerService);
  private readonly appointmentService = inject(AppointmentService);
  private readonly billService = inject(BillService);

  customer = toSignal(
    this.route.params.pipe(
      switchMap(params => this.customerService.getById(+params['id']))
    )
  );

  appointments = toSignal(
    this.route.params.pipe(
      switchMap(params => this.appointmentService.getByCustomerId(+params['id']))
    ),
    { initialValue: [] }
  );

  bills = toSignal(
    this.route.params.pipe(
      switchMap(params => this.billService.getByCustomerId(+params['id']))
    ),
    { initialValue: [] }
  );
}
