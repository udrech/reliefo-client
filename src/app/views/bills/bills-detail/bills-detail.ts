import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';

import { BillService } from '@/services/bill.service';
import { CustomerService } from '@/services/customer.service';

@Component({
  selector: 'app-bills-detail',
  imports: [
    DatePipe,
  ],
  templateUrl: './bills-detail.html',
  styleUrl: './bills-detail.css',
})
export class BillsDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly billService = inject(BillService);
  private readonly customerService = inject(CustomerService);

  protected readonly bill = toSignal(
    this.route.params.pipe(
      switchMap(params => this.billService.getById(+params['id']))
    )
  );

  protected readonly customer = toSignal(
    this.route.params.pipe(
      switchMap(params =>
        this.billService.getById(+params['id']).pipe(
          switchMap(bill =>
            bill?.customerId
              ? this.customerService.getById(bill.customerId)
              : of(null)
          )
        )
      )
    ),
    { initialValue: null }
  );
}
