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

import { CustomerService } from '@/services/customer.service';
import { combineDateParts, toDateParts } from '@/utils/date.utils';

@Component({
  selector: 'app-customers-form',
  imports: [
    ButtonModule,
    InputTextModule,
    KeyFilterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './customers-form.html',
  styleUrl: './customers-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersForm {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly customerService = inject(CustomerService);

  private readonly customerId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id')))
  );

  protected readonly isNew = computed(() => !this.customerId());

  private readonly customer = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        return id ? this.customerService.getById(Number(id)) : of(null);
      })
    )
  );

  protected readonly form = new FormGroup({
    lastName: new FormControl('', { validators: Validators.required, nonNullable: true }),
    firstName: new FormControl('', { validators: Validators.required, nonNullable: true }),
    dateOfBirth: new FormGroup({
      day: new FormControl<string | null>(null, { validators: [Validators.min(1), Validators.max(31)] }),
      month: new FormControl<string | null>(null, { validators: [Validators.min(1), Validators.max(12)] }),
      year: new FormControl<string | null>(null, { validators: [Validators.min(1000), Validators.max(9999)] }),
    }),
    address: new FormControl<string | null>(null),
    city: new FormControl<string | null>(null),
    zipCode: new FormControl<string | null>(null),
    country: new FormControl<string | null>(null),
    email: new FormControl<string | null>(null),
    phone: new FormControl<string | null>(null),
    mobile: new FormControl<string | null>(null),
    socialSecurityNumber: new FormControl<string | null>(null),
    healthInsuranceProvider: new FormControl<string | null>(null),
    healthInsuranceId: new FormControl<string | null>(null),
  });

  constructor() {
    effect(() => {
      const customer = this.customer();
      if (customer) {
        untracked(() => this.form.patchValue({
          ...customer,
          dateOfBirth: customer.dateOfBirth ? toDateParts(customer.dateOfBirth) : { day: null, month: null, year: null },
        }));
      }
    });
  }

  protected save(): void {
    if (this.form.invalid) return;
    const { dateOfBirth, ...rest } = this.form.getRawValue();
    const value = {
      ...rest,
      dateOfBirth: dateOfBirth.day && dateOfBirth.month && dateOfBirth.year
        ? combineDateParts({ day: dateOfBirth.day, month: dateOfBirth.month, year: dateOfBirth.year })
        : null,
    };
    const id = this.customerId();
    if (id) {
      this.customerService.update(Number(id), value).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Erfolg', detail: 'Kunde aktualisiert', life: 3000 });
        this.router.navigate(['/kunden']);
      });
    } else {
      this.customerService.create(value).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Erfolg', detail: 'Kunde erstellt', life: 3000 });
        this.router.navigate(['/kunden']);
      });
    }
  }

  protected cancel(): void {
    this.router.navigate(['/kunden']);
  }

  protected focusNextOnFilled(event: Event, next: HTMLInputElement): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length >= input.maxLength) {
      next.focus();
    }
  }
}
