import { ChangeDetectionStrategy, Component, computed, effect, inject, untracked } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';

import { AppointmentService } from '@/services/appointment.service';
import { CustomerService } from '@/services/customer.service';
import { TherapyService } from '@/services/therapy.service';
import { combineDateAndTime, toDateParts, toTimeParts } from '@/utils/date.utils';

@Component({
  selector: 'app-appointments-form',
  imports: [
    ButtonModule,
    DatePipe,
    InputNumberModule,
    ReactiveFormsModule,
    SelectModule,
  ],
  templateUrl: './appointments-form.html',
  styleUrl: './appointments-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentsForm {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly appointmentService = inject(AppointmentService);
  private readonly customerService = inject(CustomerService);
  private readonly therapyService = inject(TherapyService);

  private readonly appointmentId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('aid')))
  );

  protected readonly isNew = computed(() => !this.appointmentId());

  protected readonly customers = toSignal(
    this.customerService.getAll(),
    { initialValue: [] }
  );

  private readonly appointment = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('aid');
        return id ? this.appointmentService.getById(Number(id)) : of(null);
      })
    )
  );

  protected readonly form = new FormGroup({
    customerId: new FormControl<number | null>(null, { validators: Validators.required }),
    therapyId: new FormControl<number | null>(null, { validators: Validators.required }),
    appointmentDate: new FormGroup({
      day: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(1), Validators.max(31)] }),
      month: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(1), Validators.max(12)] }),
      year: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(1000), Validators.max(9999)] }),
    }),
    appointmentTime: new FormGroup({
      hour: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0), Validators.max(23)] }),
      minute: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0), Validators.max(59)] }),
    }),
  });

  protected readonly therapies = toSignal(
    this.form.controls.appointmentDate.valueChanges.pipe(
      map(({ day, month, year }) =>
        day != null && month != null && year != null ? combineDateAndTime({ day, month, year }, { hour: 0, minute: 0 }) : null
      ),
      switchMap(d => d ? this.therapyService.getValid(d) : of([]))
    ),
    { initialValue: [] }
  );

  constructor() {
    effect(() => {
      const appointment = this.appointment();
      if (appointment) {
        untracked(() => {
          const timestamp = appointment.appointmentTimestamp;
          this.form.patchValue({
            customerId: appointment.customerId,
            therapyId: appointment.therapyId,
            appointmentDate: toDateParts(timestamp),
            appointmentTime: toTimeParts(timestamp),
          });
        });
      }
    });
  }

  protected save(mode: 'new' | 'back'): void {
    if (this.form.invalid) return;
    const { customerId, therapyId, appointmentDate, appointmentTime } = this.form.getRawValue();
    const id = this.appointmentId();

    if (
      !customerId || !therapyId ||
      appointmentDate.day == null || appointmentDate.month == null || appointmentDate.year == null ||
      appointmentTime.hour == null || appointmentTime.minute == null
    ) return;

    const appointmentTimestamp = combineDateAndTime(
      { day: appointmentDate.day, month: appointmentDate.month, year: appointmentDate.year },
      { hour: appointmentTime.hour, minute: appointmentTime.minute }
    );

    const payload = {
      customerId: Number(customerId),
      therapyId: therapyId!,
      appointmentTimestamp,
    };

    const navigate = () => {
      if (mode === 'new') {
        this.form.reset();
        this.router.navigate(['/termine', 'neu']);
      } else {
        this.router.navigate(['/termine']);
      }
    };

    if (id) {
      this.appointmentService.update(Number(id), payload).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Erfolg', detail: 'Termin aktualisiert', life: 3000 });
        navigate();
      });
    } else {
      this.appointmentService.create(payload).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Erfolg', detail: 'Termin erstellt', life: 3000 });
        navigate();
      });
    }
  }

  protected cancel(): void {
    this.router.navigate(['/termine']);
  }
}
