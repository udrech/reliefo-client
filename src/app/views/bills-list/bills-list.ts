import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { TableModule } from 'primeng/table';
import { BillService } from '../../services/bill.service';

@Component({
  selector: 'app-bills-list',
  imports: [DatePipe, RouterLink, TableModule],
  templateUrl: './bills-list.html',
  styleUrl: './bills-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillsList {
  private readonly billService = inject(BillService);

  private readonly refresh = signal(0);

  protected readonly bills = toSignal(
    toObservable(this.refresh).pipe(
      switchMap(() => this.billService.getAll())
    ),
    { initialValue: [] }
  );
}
