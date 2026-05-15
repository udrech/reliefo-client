import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith, switchMap, Subject } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { AppointmentService } from '@/services/appointment.service';

@Component({
  selector: 'app-appointments-list',
  imports: [
    ButtonModule,
    DatePipe,
    RouterLink,
    TableModule,
    TooltipModule,
  ],
  templateUrl: './appointments-list.html',
  styleUrl: './appointments-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentsList {
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly appointmentService = inject(AppointmentService);

  private readonly refresh$ = new Subject<void>();
  
  protected readonly appointments = toSignal(
    this.refresh$.pipe(
      startWith(null),
      switchMap(() => this.appointmentService.getAll())
    ),
    { initialValue: [] }
  );

  protected deleteAppointment(id: number): void {
    this.confirmationService.confirm({
      message: 'Möchten sie den Termin wirklich löschen?',
      header: 'Termin löschen',
      rejectButtonProps: { label: 'Abbrechen', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Löschen', severity: 'danger' },
      accept: () => {
        this.appointmentService.delete(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Erfolg', detail: 'Termin gelöscht', life: 3000 });
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

  protected appointmentIsToday(timestamp: string): boolean {
    const appointmentDate = new Date(timestamp).toDateString();
    const today = new Date().toDateString();
    return appointmentDate === today;
  }
}
