import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith, switchMap, Subject } from 'rxjs';
import { TableModule } from 'primeng/table';

import { BillService } from '../../services/bill.service';

@Component({
  selector: 'app-bills-list',
  imports: [
    DatePipe,
    RouterLink,
    TableModule,
  ],
  templateUrl: './bills-list.html',
  styleUrl: './bills-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillsList {
  private readonly billService = inject(BillService);

  private readonly refresh$ = new Subject<void>();

  protected readonly bills = toSignal(
    this.refresh$.pipe(
      startWith(null),
      switchMap(() => this.billService.getAll())
    ),
    { initialValue: [] }
  );

  protected deleteBill(id: number): void {
    this.billService.delete(id).subscribe(() => this.refresh$.next());
  }
}
