import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';

import { NavItem } from '@/models/nav-item';
import { VersionService } from '@/services/version.service';

@Component({
  selector: 'app-layout',
  imports: [
    ConfirmDialog,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    Toast,
  ],
  providers: [
    ConfirmationService,
    MessageService,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {
  private readonly versionService = inject(VersionService);

  protected readonly sidebarMinimized = signal(false);
  protected readonly versionInfo = toSignal(this.versionService.getVersion(), {
    initialValue: { version: '', releaseDate: '' },
  });

  protected readonly navItems: NavItem[] = [
    { label: 'Kunden', icon: 'user_attributes', route: '/kunden' },
    { label: 'Termine', icon: 'calendar_month', route: '/termine' },
    { label: 'Quittungen', icon: 'receipt', route: '/quittungen' },
    { label: 'Massagen', icon: 'massage', route: '/massagen' },
    { label: 'Statistiken', icon: 'bar_chart', route: '/statistiken' }
  ];

  // Client Version
  protected version = '1';
  protected releaseDate = '27.05.2026';

  protected get apiVersion(): string {
    return this.versionInfo().version;
  }

  protected get apiReleaseDate(): string {
    return this.versionInfo().releaseDate;
  }

  protected toggleSidebar(): void {
    this.sidebarMinimized.update((v) => !v);
  }
}
