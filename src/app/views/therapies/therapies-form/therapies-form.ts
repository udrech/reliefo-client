import { ChangeDetectionStrategy, Component, computed, effect, inject, untracked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';

import { TherapyService } from '@/services/therapy.service';
import { combineDateParts, toDateParts } from '@/utils/date.utils';

@Component({
  selector: 'app-therapies-form',
  imports: [
    ButtonModule,
    InputTextModule,
    KeyFilterModule,
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

  private readonly today = toDateParts(new Date());

  protected readonly form = new FormGroup({
    name: new FormControl('', { validators: Validators.required, nonNullable: true }),
    nameOnBill: new FormControl('', { validators: Validators.required, nonNullable: true }),
    description: new FormControl<string | null>(null),
    duration: new FormControl<number | null>(null),
    price: new FormControl(0, { nonNullable: true }),
    validFrom: new FormGroup({
      day: new FormControl<string | null>(this.today.day, { validators: [Validators.required, Validators.min(1), Validators.max(31)] }),
      month: new FormControl<string | null>(this.today.month, { validators: [Validators.required, Validators.min(1), Validators.max(12)] }),
      year: new FormControl<string | null>(this.today.year, { validators: [Validators.required, Validators.min(1000), Validators.max(9999)] }),
    }),
    validTo: new FormGroup({
      day: new FormControl<string | null>(null, { validators: [Validators.min(1), Validators.max(31)] }),
      month: new FormControl<string | null>(null, { validators: [Validators.min(1), Validators.max(12)] }),
      year: new FormControl<string | null>(null, { validators: [Validators.min(1000), Validators.max(9999)] }),
    }),
  });

  constructor() {
    effect(() => {
      const therapy = this.therapy();
      if (therapy) {
        untracked(() => this.form.patchValue({
          ...therapy,
          validFrom: toDateParts(therapy.validFrom),
          validTo: therapy.validTo ? toDateParts(therapy.validTo) : { day: null, month: null, year: null },
        }));
      }
    });
  }

  protected save(): void {
    if (this.form.invalid) return;
    const { validFrom, validTo, ...rest } = this.form.getRawValue();
    if (!validFrom.day || !validFrom.month || !validFrom.year) return;

    const value = {
      ...rest,
      validFrom: combineDateParts({ day: validFrom.day, month: validFrom.month, year: validFrom.year }),
      validTo: validTo.day && validTo.month && validTo.year
        ? combineDateParts({ day: validTo.day, month: validTo.month, year: validTo.year })
        : null,
    };

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

  protected focusNextOnFilled(event: Event, next: HTMLInputElement): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length >= input.maxLength) {
      next.focus();
    }
  }
}
