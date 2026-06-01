import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { CustomerDetailStore } from '@/views/customers/customers-detail/customer-detail.store';

import { Bill } from '@/models/bill';
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
  protected readonly store = inject(CustomerDetailStore);
  private readonly billService = inject(BillService);
  
  protected readonly bills = this.store.bills;

  protected downloadBill(bill: Bill): void {
    this.billService.download(bill.id).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = bill.filename;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

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
            this.store.loadBills();
            this.store.loadAppointments();
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

