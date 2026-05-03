import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, Subject } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { CustomerService } from '@/services/customer.service';

@Component({
  selector: 'app-customers-list',
  imports: [
    ButtonModule,
    DatePipe,
    RouterLink,
    TableModule,
    TooltipModule,
  ],
  templateUrl: './customers-list.html',
  styleUrl: './customers-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersList {
  private readonly customerService = inject(CustomerService);

  private readonly refresh$ = new Subject<void>();

  protected readonly customers = toSignal(
    this.refresh$.pipe(
      switchMap(() => this.customerService.getAll())
    ),
    { initialValue: [] }
  );

  constructor() {
    this.refresh$.next();
  }

  protected deleteCustomer(id: number): void {
    this.customerService.delete(id).subscribe(() => this.refresh$.next());
  }
}
