import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TherapyService } from '../../services/therapy.service';

@Component({
  selector: 'app-therapies-list',
  imports: [
    ButtonModule,
    RouterLink,
    TableModule,
  ],
  templateUrl: './therapies-list.html',
  styleUrl: './therapies-list.css',
})
export class TherapiesList {
  private readonly therapyService = inject(TherapyService);

  private readonly refresh = signal(0);

  protected readonly therapies = toSignal(
    toObservable(this.refresh).pipe(
      switchMap(() => this.therapyService.getAll())
    ),
    { initialValue: [] }
  );
}
