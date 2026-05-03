import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Toast } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { Appointment } from '@/models/appointment';
import { AppointmentService } from '@/services/appointment.service';
import { BillService } from '@/services/bill.service';

@Component({
  selector: 'app-appointments-list',
  imports: [
    ButtonModule,
    DatePipe,
    DecimalPipe,
    RouterLink,
    TableModule,
    Toast,
    TooltipModule,
  ],
  providers: [MessageService],
  templateUrl: './appointments-list.html',
  styleUrl: './appointments-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentsList {
  private readonly router = inject(Router);
  private messageService = inject(MessageService);
  private readonly appointmentService = inject(AppointmentService);
  private readonly billService = inject(BillService);

  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  protected readonly selectedAppointments = signal<Appointment[]>([]);

  readonly customerId = input<number>();

  protected readonly appointments = toSignal(
    combineLatest([toObservable(this.customerId), this.refresh$]).pipe(
      switchMap(([id]) => id ? this.appointmentService.getByCustomerId(id) : of([]))
    ),
    { initialValue: [] }
  );

  protected deleteAppointment(id: number): void {
    this.appointmentService.delete(id).subscribe(() => this.refresh$.next());
  }

  protected createBill(): void {
    // check if any selected appointments exist, otherwise notify the user
    // use p-toast, show message at bottom center, with severity 'warn' and summary 'Keine Termine ausgewählt' and detail 'Bitte wählen Sie mindestens einen Termin aus, um eine Quittung zu erstellen.'
    if (this.selectedAppointments().length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Fehler',
        detail: 'Keine Termine ausgewählt',
      });
      return;
    }

    console.log('Creating bill for appointments:', this.selectedAppointments());

    const customerId = this.customerId();
    if (customerId) {
      this.billService.create({
        customerId: customerId,
        appointments: this.selectedAppointments(),
      }).subscribe(() => {
        this.router.navigate(['/bills']);
      });
    }
  }
}
