import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
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
    DecimalPipe,
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

  readonly appointments = input<Appointment[]>([]);

  protected readonly customerId = toSignal(
    inject(ActivatedRoute).paramMap.pipe(map((params) => params.get('id')))
  );

  protected deleteAppointment(id: number): void {
    this.appointmentService.delete(id).subscribe(() => this.refresh$.next());
  }
}
