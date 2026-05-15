import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ConfirmationService, MessageService } from 'primeng/api';
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
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
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
    this.confirmationService.confirm({
      message: 'Möchten sie die Quittung wirklich löschen?',
      header: 'Quittung löschen',
      rejectButtonProps: { label: 'Abbrechen', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Löschen', severity: 'danger' },
      accept: () => {
        this.billService.delete(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Erfolg', detail: 'Quittung gelöscht', life: 3000 });
            this.refresh$.next();
          },
          error: (err: HttpErrorResponse) => {
            if (err.status === 409) {
              this.messageService.add({ severity: 'error', summary: 'Fehler', detail: err.error, life: 5000 });
            }
          },
        });
      }
    });
  }
}
