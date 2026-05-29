import { ChangeDetectionStrategy, Component, computed, effect, inject, untracked } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';

import { AppointmentService } from '@/services/appointment.service';
import { CustomerService } from '@/services/customer.service';
import { TherapyService } from '@/services/therapy.service';

@Component({
  selector: 'app-appointments-form',
  imports: [
    ButtonModule,
    DatePipe,
    DatePickerModule,
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
  
  private readonly customerId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id')))
  );

  private readonly appointmentId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('aid')))
  );

  protected readonly isNew = computed(() => !this.appointmentId());

  protected readonly customer = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => this.customerService.getById(+params.get('id')!))
    )
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
    therapyId: new FormControl<number | null>(null, { validators: Validators.required }),
    appointmentTimestamp: new FormControl<Date | null>(null, { validators: Validators.required }),
  });

  protected readonly therapies = toSignal(
    this.form.controls.appointmentTimestamp.valueChanges.pipe(
      switchMap(d => d ? this.therapyService.getValid(d) : of([]))
    ),
    { initialValue: [] }
  );

  constructor() {
    effect(() => {
      const appointment = this.appointment();
      if (appointment) {
        untracked(() => this.form.patchValue({
          therapyId: appointment.therapyId,
          appointmentTimestamp: appointment.appointmentTimestamp,
        }));
      }
    });
  }

  protected save(): void {
    if (this.form.invalid) return;
    const { therapyId, appointmentTimestamp } = this.form.getRawValue();
    const id = this.appointmentId();
    const customerId = this.customerId();
    
    if (!customerId) return;

    const payload = {
      customerId: Number(customerId),
      therapyId: therapyId!,
      appointmentTimestamp: appointmentTimestamp!,
    };

    if (id) {
      this.appointmentService.update(Number(id), payload).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Erfolg', detail: 'Termin aktualisiert', life: 3000 });
        this.router.navigate(['/kunden', String(customerId), 'termine']);
      });
    } else {
      this.appointmentService.create(payload).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Erfolg', detail: 'Termin erstellt', life: 3000 });
        this.router.navigate(['/kunden', String(customerId), 'termine']);
      });
    }
  }

  protected cancel(): void {
    const customerId = this.customerId();
    if (customerId) {
      this.router.navigate(['/kunden', String(customerId)]);
    }
  }
}
