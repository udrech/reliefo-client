import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';

import { NavItem } from '@/models/nav-item';

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
  protected readonly sidebarMinimized = signal(false);

  protected readonly navItems: NavItem[] = [
    { label: 'Kunden', icon: 'user_attributes', route: '/kunden' },
    { label: 'Termine', icon: 'calendar_month', route: '/termine' },
    { label: 'Quittungen', icon: 'receipt', route: '/quittungen' },
    { label: 'Massagen', icon: 'massage', route: '/massagen' },
  ];

  protected toggleSidebar(): void {
    this.sidebarMinimized.update((v) => !v);
  }
}
