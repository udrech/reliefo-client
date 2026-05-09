import { ChangeDetectionStrategy, Component, computed, effect, inject, untracked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';

import { TherapyService } from '@/services/therapy.service';

@Component({
  selector: 'app-therapies-form',
  imports: [
    ButtonModule,
    DatePickerModule,
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

  protected async save(): Promise<void> {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    const id = this.routeId();
    try {
      if (id) {
        await firstValueFrom(this.therapyService.update(Number(id), value));
      } else {
        await firstValueFrom(this.therapyService.create(value));
      }
      await this.router.navigate(['/massagen']);
    } catch (error) {
      console.error('Error saving therapy:', error);
    }
  }

  protected async cancel(): Promise<void> {
    await this.router.navigate(['/massagen']);
  }
}
