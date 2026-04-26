import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith, switchMap, Subject } from 'rxjs';
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
    this.appointmentService.delete(id).subscribe(() => this.refresh$.next());
  }

  protected appointmentIsToday(timestamp: string): boolean {
    const appointmentDate = new Date(timestamp).toDateString();
    const today = new Date().toDateString();
    return appointmentDate === today;
  }
}
