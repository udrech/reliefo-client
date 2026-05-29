import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { MedicalHistoryRecordService } from '@/services/medicalhistoryrecord';
import { CustomerDetailStore } from '@/views/customers/customers-detail/customer-detail.store';

@Component({
  selector: 'app-medicalhistoryrecords-list',
  imports: [
    ButtonModule,
    DatePipe,
    RouterLink,
    TableModule,
    TooltipModule,
  ],
  templateUrl: './medicalhistoryrecords-list.html',
  styleUrl: './medicalhistoryrecords-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalhistoryrecordsList {
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  protected readonly store = inject(CustomerDetailStore);
  private readonly medicalHistoryRecordService = inject(MedicalHistoryRecordService);

  protected readonly records = this.store.medicalHistoryRecords;

  protected delete(id: number): void {
    this.confirmationService.confirm({
      message: 'Möchten sie den Eintrag wirklich löschen?',
      header: 'Eintrag löschen',
      rejectButtonProps: { label: 'Abbrechen', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Löschen', severity: 'danger' },
      accept: () => {
        this.medicalHistoryRecordService.delete(id).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Erfolg', detail: 'Eintrag gelöscht', life: 3000 });
          this.store.loadMedicalHistoryRecords();
        });
      }
    });
  }
}
