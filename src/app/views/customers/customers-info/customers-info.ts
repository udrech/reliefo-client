import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';

import { CustomerDetailStore } from '@/views/customers/customers-detail/customer-detail.store';

@Component({
  selector: 'app-customers-info',
  imports: [
    DatePipe,
  ],
  templateUrl: './customers-info.html',
  styleUrl: './customers-info.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersInfo {
  protected readonly store = inject(CustomerDetailStore);
}
