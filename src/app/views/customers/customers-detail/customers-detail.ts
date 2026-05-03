import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map } from 'rxjs';
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
  private readonly router = inject(Router);
  private readonly appointmentService = inject(AppointmentService);
  private readonly customerService = inject(CustomerService);
  private readonly billService = inject(BillService);

  private getTabValue(tab: string): number {
    switch (tab) {
      case 'termine':
        return 1;
      case 'quittungen':
        return 2;
      case 'kunde':
      default:
        return 0;
    }
  }

  protected readonly activeTab = toSignal(
    this.route.queryParamMap.pipe(
      map(params => this.getTabValue(params.get('tab') || 'kunde'))
    ),
    { initialValue: 0 }
  );

  protected readonly customer = toSignal(
    this.route.params.pipe(
      switchMap(params => this.customerService.getById(+params['id']))
    )
  );

  protected readonly appointments = toSignal(
    this.route.params.pipe(
      switchMap(params => this.appointmentService.getByCustomerId(+params['id']))
    ),
    { initialValue: [] }
  );

  protected readonly bills = toSignal(
    this.route.params.pipe(
      switchMap(params => this.billService.getByCustomerId(+params['id']))
    ),
    { initialValue: [] }
  );
}
