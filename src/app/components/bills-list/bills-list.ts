import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';

import { Bill } from '../../models/bill';

@Component({
  selector: 'app-bills-list',
  imports: [
    DatePipe,
    TableModule,
  ],
  templateUrl: './bills-list.html',
  styleUrl: './bills-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillsList {
  bills = input<Bill[]>([]);
}
