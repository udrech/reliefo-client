import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TabsModule } from 'primeng/tabs';

import { CustomerDetailStore } from '@/views/customers/customers-detail/customer-detail.store';

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
  providers: [CustomerDetailStore],
  templateUrl: './customers-detail.html',
  styleUrl: './customers-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersDetail {
  private readonly route = inject(ActivatedRoute);
  protected readonly store = inject(CustomerDetailStore);

  private readonly routeCustomerId = toSignal(
    this.route.params.pipe(map(params => +params['id']))
  );

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

  constructor() {
    effect(() => {
      const id = this.routeCustomerId();
      if (id) this.store.load(id);
    });
  }
}
