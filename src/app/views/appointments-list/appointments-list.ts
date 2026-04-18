import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';

import { Appointment } from '../../models/appointment';
import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-appointments-list',
  imports: [
    DatePipe,
    RouterLink,
    TableModule,
  ],
  templateUrl: './appointments-list.html',
  styleUrl: './appointments-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentsList {
  private readonly appointmentService = inject(AppointmentService);

  protected readonly appointments = signal<Appointment[]>([]);

  ngOnInit(): void {
    this.appointmentService.getAll().subscribe((data) => this.appointments.set(data));
  }

  isToday(timestamp: string): boolean {
    const appointmentDate = new Date(timestamp).toDateString();
    const today = new Date().toDateString();
    return appointmentDate === today;
  }
}
