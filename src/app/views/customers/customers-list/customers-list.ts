import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, Subject } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { CustomerService } from '@/services/customer.service';

@Component({
  selector: 'app-customers-list',
  imports: [
    ButtonModule,
    DatePipe,
    RouterLink,
    TableModule,
    TooltipModule,
  ],
  templateUrl: './customers-list.html',
  styleUrl: './customers-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersList {
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly customerService = inject(CustomerService);

  private readonly refresh$ = new Subject<void>();

  protected readonly customers = toSignal(
    this.refresh$.pipe(
      switchMap(() => this.customerService.getAll())
    ),
    { initialValue: [] }
  );

  constructor() {
    this.refresh$.next();
  }

  protected deleteCustomer(id: number): void {
    this.confirmationService.confirm({
      message: 'Möchten sie den Kunden wirklich löschen?',
      header: 'Kunden löschen',
      rejectButtonProps: { label: 'Abbrechen', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Löschen', severity: 'danger' },
      accept: () => {
        this.customerService.delete(id).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Erfolg', detail: 'Kunden gelöscht', life: 3000 });
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

  protected customerHasBirthdayToday(timestamp: string): boolean {
    const birthDate = new Date(timestamp);
    const today = new Date();
    return birthDate.getDate() === today.getDate() && birthDate.getMonth() === today.getMonth();    
  }
}
