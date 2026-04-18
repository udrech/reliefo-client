import { ChangeDetectionStrategy, Component, computed, effect, inject, untracked } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customers-form',
  imports: [
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  templateUrl: './customers-form.html',
  styleUrl: './customers-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersForm {
  private readonly customerService = inject(CustomerService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly routeId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id')))
  );

  protected readonly isNew = computed(() => !this.routeId());

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
        untracked(() => this.form.patchValue(customer));
      }
    });
  }

  protected save(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    const id = this.routeId();
    if (id) {
      this.customerService.update(Number(id), value).subscribe(() => {
        this.router.navigate(['/kunden']);
      });
    } else {
      this.customerService.create(value).subscribe(() => {
        this.router.navigate(['/kunden']);
      });
    }
  }

  protected cancel(): void {
    this.router.navigate(['/kunden']);
  }
}
