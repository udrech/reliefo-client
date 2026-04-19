import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { Bill } from '../../models/bill';
import { BillService } from '../../services/bill.service';

@Component({
  selector: 'app-bills-list',
  imports: [
    ButtonModule,
    DatePipe,
    TableModule,
    TooltipModule,
  ],
  templateUrl: './bills-list.html',
  styleUrl: './bills-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillsList {
  private readonly billService = inject(BillService);

  readonly bills = input<Bill[]>([]);

  protected deleteBill(id: number): void {
    // this.billService.delete(id).subscribe(() => this.refresh$.next());
  }
}
