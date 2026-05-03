import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith, switchMap, Subject } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { TherapyService } from '@/services/therapy.service';

@Component({
  selector: 'app-therapies-list',
  imports: [
    ButtonModule,
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
    this.therapyService.delete(id).subscribe(() => this.refresh$.next());
  }
}
