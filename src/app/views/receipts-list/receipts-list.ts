import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ReceiptService } from '../../services/receipt.service';

@Component({
  selector: 'app-receipts-list',
  imports: [DatePipe, RouterLink, TableModule],
  templateUrl: './receipts-list.html',
  styleUrl: './receipts-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceiptsList {
  private readonly receiptService = inject(ReceiptService);

  private readonly refresh = signal(0);

  protected readonly receipts = toSignal(
    toObservable(this.refresh).pipe(
      switchMap(() => this.receiptService.getAll())
    ),
    { initialValue: [] }
  );
}
