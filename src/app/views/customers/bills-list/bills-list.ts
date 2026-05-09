import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { BillService } from '@/services/bill.service';

@Component({
  selector: 'app-bills-list',
  imports: [
    ButtonModule,
    DatePipe,
    RouterLink,
    TableModule,
    TooltipModule,
  ],
  templateUrl: './bills-list.html',
  styleUrl: './bills-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillsList {
  private readonly billService = inject(BillService);

  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  readonly customerId = input<number>();

  protected readonly bills = toSignal(
    combineLatest([toObservable(this.customerId), this.refresh$]).pipe(
      switchMap(([id]) => id ? this.billService.getByCustomerId(id) : of([]))
    ),
    { initialValue: [] }
  );

  protected deleteBill(id: number): void {
    this.billService.delete(id).subscribe(() => this.refresh$.next());
  }
}
