import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith, switchMap, Subject } from 'rxjs';
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

  private readonly refresh$ = new Subject<void>();

  protected readonly bills = toSignal(
    this.refresh$.pipe(
      startWith(null),
      switchMap(() => this.billService.getAll())
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
        this.billService.delete(id).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Erfolg', detail: 'Quittung gelöscht', life: 3000 });
          this.refresh$.next();
        });
      }
    });
  }
}
