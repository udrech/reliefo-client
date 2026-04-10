import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customers-form',
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: './customers-form.html',
  styleUrl: './customers-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersForm implements OnInit {
  private readonly customerService = inject(CustomerService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private customerId: number | null = null;
  protected readonly isNew = signal(true);

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

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;
    if (id) {
      this.customerId = id;
      this.isNew.set(false);
      this.customerService.getById(id).subscribe((customer) => {
        this.form.patchValue(customer);
      });
    }
  }

  protected save(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    if (this.customerId) {
      this.customerService.update(this.customerId, value).subscribe(() => {
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
