import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { CustomerService } from '../../services/customer.service';

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

  private readonly refresh = signal(0);

  protected readonly customers = toSignal(
    toObservable(this.refresh).pipe(
      switchMap(() => this.customerService.getAll())
    ),
    { initialValue: [] }
  );

  protected deleteCustomer(id: number): void {
    this.customerService.delete(id).subscribe(() => {
      this.refresh.update((v) => v + 1);
    });
  }
}
