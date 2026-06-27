import { ChangeDetectionStrategy, Component, computed, effect, inject, untracked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';

import { TherapyService } from '@/services/therapy.service';

@Component({
  selector: 'app-therapies-form',
  imports: [
    ButtonModule,
    DatePickerModule,
    InputMaskModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  templateUrl: './therapies-form.html',
  styleUrl: './therapies-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TherapiesForm {
  private readonly therapyService = inject(TherapyService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  private readonly routeId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id'))),
    { initialValue: null }
  );

  protected readonly isNew = computed(() => !this.routeId());

  private readonly therapy = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        return id ? this.therapyService.getById(Number(id)) : of(null);
      })
    ),
    { initialValue: null }
  );

  protected readonly form = new FormGroup({
    name: new FormControl('', { validators: Validators.required, nonNullable: true }),
    nameOnBill: new FormControl('', { validators: Validators.required, nonNullable: true }),
    description: new FormControl<string | null>(null),
    duration: new FormControl<number | null>(null),
    price: new FormControl(0, { nonNullable: true }),
    validFrom: new FormControl<Date>(new Date(), { nonNullable: true }),
    validTo: new FormControl<Date | null>(null),
  });

  constructor() {
    effect(() => {
      const therapy = this.therapy();
      if (therapy) {
        untracked(() => this.form.patchValue(therapy));
      }
    });
  }

  protected save(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    const id = this.routeId();
    if (id) {
      this.therapyService.update(Number(id), value).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Erfolg', detail: 'Massage aktualisiert', life: 3000 });
        this.router.navigate(['/massagen']);
      });
    } else {
      this.therapyService.create(value).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Erfolg', detail: 'Massage erstellt', life: 3000 });
        this.router.navigate(['/massagen']);
      });
    }
  }

  protected cancel(): void {
    this.router.navigate(['/massagen']);
  }
}
