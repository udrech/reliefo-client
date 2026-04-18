import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { TabsModule } from 'primeng/tabs';

import { AppointmentsList } from '../../components/appointments-list/appointments-list';
import { AppointmentService } from '../../services/appointment.service';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customers-detail',
  imports: [
    AppointmentsList,
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
}
