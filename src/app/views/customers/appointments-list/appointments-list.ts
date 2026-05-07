import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
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
    ConfirmPopupModule,
    DatePipe,
    RouterLink,
    TableModule,
    Toast,
    TooltipModule,
  ],
  providers: [
    ConfirmationService,
    MessageService,
  ],
  templateUrl: './appointments-list.html',
  styleUrl: './appointments-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentsList {
  private readonly router = inject(Router);
  private confirmationService = inject(ConfirmationService);
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

  protected deleteAppointment(id: number, event: Event): void {
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Möchten sie den Termin wirklich löschen?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Abbrechen',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Löschen',
        severity: 'danger'
      },
      accept: () => {
        this.appointmentService.delete(id).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Erfolg', detail: 'Termin gelöscht', life: 3000 });
          this.refresh$.next();
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Abgebrochen', detail: 'Löschen abgebrochen', life: 3000 });
      }
    });
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
