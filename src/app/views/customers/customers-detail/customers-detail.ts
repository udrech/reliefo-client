import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, merge, of } from 'rxjs';
import { TabsModule } from 'primeng/tabs';

import { CustomerDetailStore } from '@/views/customers/customers-detail/customer-detail.store';

@Component({
  selector: 'app-customers-detail',
  imports: [
    RouterOutlet,
    TabsModule,
  ],
  providers: [CustomerDetailStore],
  templateUrl: './customers-detail.html',
  styleUrl: './customers-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly store = inject(CustomerDetailStore);

  private readonly routeCustomerId = toSignal(
    this.route.params.pipe(map(params => +params['id']))
  );

  private getTabFromUrl(url: string): number {
    if (url.includes('/termine')) return 1;
    if (url.includes('/krankengeschichte')) return 2;
    if (url.includes('/quittungen')) return 3;
    return 0;
  }

  protected readonly activeTab = toSignal(
    merge(
      of(this.router.url),
      this.router.events.pipe(
        filter(e => e instanceof NavigationEnd),
        map(e => (e as NavigationEnd).urlAfterRedirects),
      ),
    ).pipe(map(url => this.getTabFromUrl(url))),
    { initialValue: 0 },
  );

  protected navigate(segment: string): void {
    this.router.navigate([segment], { relativeTo: this.route });
  }

  constructor() {
    effect(() => {
      const id = this.routeCustomerId();
      if (id) this.store.load(id);
    });
  }
}
