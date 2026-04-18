import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TableModule } from 'primeng/table';

import { Appointment } from '../../models/appointment';

@Component({
  selector: 'app-appointments-list',
  imports: [
    DatePipe,
    DecimalPipe,
    TableModule,
  ],
  templateUrl: './appointments-list.html',
  styleUrl: './appointments-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentsList {
  appointments = input<Appointment[]>([]);
}
