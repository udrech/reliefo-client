import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, Subject } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { TherapyService } from '@/services/therapy.service';

@Component({
  selector: 'app-therapies-list',
  imports: [
    ButtonModule,
    DatePipe,
    RouterLink,
    TableModule,
    TooltipModule,
  ],
  templateUrl: './therapies-list.html',
  styleUrl: './therapies-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TherapiesList {
  private readonly therapyService = inject(TherapyService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  private readonly refresh$ = new Subject<void>();

  protected readonly therapies = toSignal(
    this.refresh$.pipe(
      switchMap(() => this.therapyService.getAll())
    ),
    { initialValue: [] }
  );

  constructor() {
    this.refresh$.next();
  }

  protected deleteTherapy(id: number): void {
    this.confirmationService.confirm({
      message: 'Möchten sie die Massage wirklich löschen?',
      header: 'Massage löschen',
      rejectButtonProps: { label: 'Abbrechen', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Löschen', severity: 'danger' },
      accept: () => {
        this.therapyService.delete(id).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Erfolg', detail: 'Massage gelöscht', life: 3000 });
          this.refresh$.next();
        });
      }
    });
  }
}
