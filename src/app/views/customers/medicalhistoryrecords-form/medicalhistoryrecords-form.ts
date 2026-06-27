import { ChangeDetectionStrategy, Component, computed, effect, inject, untracked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

import { CustomerService } from '@/services/customer.service';
import { MedicalHistoryRecordService } from '@/services/medicalhistoryrecord';

@Component({
  selector: 'app-medicalhistoryrecords-form',
  imports: [
    ButtonModule,
    DatePickerModule,
    ReactiveFormsModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './medicalhistoryrecords-form.html',
  styleUrl: './medicalhistoryrecords-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalhistoryrecordsForm {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly medicalHistoryRecordService = inject(MedicalHistoryRecordService);
  private readonly customerService = inject(CustomerService);

  private readonly customerId = toSignal(
    this.route.paramMap.pipe(map(params => params.get('id')))
  );

  private readonly recordId = toSignal(
    this.route.paramMap.pipe(map(params => params.get('mid')))
  );

  protected readonly typeOptions = [
    'Allergien',
    'Anamnese',
    'Medikamente',
    'Therapieplan / Ziele',
    'Übungen / Empfehlungen',
    'Verlauf',
    'Vitalparameter',
    'Vorerkrankungen',
  ];

  protected readonly isNew = computed(() => !this.recordId());

  protected readonly customer = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => this.customerService.getById(+params.get('id')!))
    )
  );

  private readonly record = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('mid');
        return id ? this.medicalHistoryRecordService.getById(Number(id)) : of(null);
      })
    )
  );

  protected readonly form = new FormGroup({
    historyDate: new FormControl<Date | null>(new Date(), { validators: Validators.required }),
    historyTime: new FormControl<Date | null>(new Date(), { validators: Validators.required }),
    historyType: new FormControl<string | null>(null),
    note: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
  });

  constructor() {
    effect(() => {
      const record = this.record();
      if (record) {
        untracked(() => {
          const timestamp = record.historyTimestamp;
          this.form.patchValue({
            historyDate: new Date(timestamp.getFullYear(), timestamp.getMonth(), timestamp.getDate()),
            historyTime: new Date(0, 0, 0, timestamp.getHours(), timestamp.getMinutes()),
            historyType: record.historyType,
            note: record.note,
          });
        });
      }
    });
  }

  protected save(): void {
    if (this.form.invalid) return;
    const { historyDate, historyTime, historyType, note } = this.form.getRawValue();
    const id = this.recordId();
    const customerId = this.customerId();

    if (!customerId || !historyDate || !historyTime) return;

    const historyTimestamp = new Date(
      historyDate.getFullYear(),
      historyDate.getMonth(),
      historyDate.getDate(),
      historyTime.getHours(),
      historyTime.getMinutes()
    );

    const payload = {
      customerId: Number(customerId),
      historyTimestamp,
      historyType: historyType ?? null,
      note,
    };

    if (id) {
      this.medicalHistoryRecordService.update(Number(id), payload).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Erfolg', detail: 'Eintrag aktualisiert', life: 3000 });
        this.router.navigate(['/kunden', String(customerId), 'krankengeschichte']);
      });
    } else {
      this.medicalHistoryRecordService.create(payload).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Erfolg', detail: 'Eintrag erstellt', life: 3000 });
        this.router.navigate(['/kunden', String(customerId), 'krankengeschichte']);
      });
    }
  }

  protected cancel(): void {
    const customerId = this.customerId();
    if (customerId) {
      this.router.navigate(['/kunden', String(customerId), 'krankengeschichte']);
    }
  }
}
