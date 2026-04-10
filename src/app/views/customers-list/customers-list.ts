import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer';

@Component({
  selector: 'app-customers-list',
  imports: [TableModule, RouterLink],
  templateUrl: './customers-list.html',
  styleUrl: './customers-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersList implements OnInit {
  private readonly customerService = inject(CustomerService);

  protected readonly customers = signal<Customer[]>([]);

  ngOnInit(): void {
    this.customerService.getAll().subscribe((data) => this.customers.set(data));
  }

  protected deleteCustomer(id: number): void {
    this.customerService.delete(id).subscribe(() => {
      this.customers.update((list) => list.filter((c) => c.id !== id));
    });
  }
}
