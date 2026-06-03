import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith, switchMap, Subject } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { Appointment } from '@/models/appointment';
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

  private readonly getStoredFilter = (): 'today' | 'past' | 'all' => {
    const stored = localStorage.getItem('appointmentFilter');
    return stored === 'today' || stored === 'past' || stored === 'all' ? stored : 'today';
  };

  readonly selectedFilter = signal<'today' | 'past' | 'all'>(this.getStoredFilter());

  constructor() {
    effect(() => {
      localStorage.setItem('appointmentFilter', this.selectedFilter());
    });
  }

  private readonly getFilteredAppointments = (
    appointments: Appointment[],
    filter: 'today' | 'past' | 'all'
  ): Appointment[] => {
    if (filter === 'all') return appointments;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filter === 'today') {
      return appointments.filter(appointment => new Date(appointment.appointmentTimestamp) >= today);
    }

    // filter === 'past'
    return appointments.filter(appointment => new Date(appointment.appointmentTimestamp) < today);
  };

  protected readonly filteredAppointments = computed(() =>
    this.getFilteredAppointments(this.appointments(), this.selectedFilter())
  );

  protected selectFilter(filter: 'today' | 'past' | 'all'): void {
    this.selectedFilter.set(filter);
  }

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
