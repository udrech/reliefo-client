import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'start',
    loadComponent: () => import('./views/start/start').then((m) => m.Start),
  },
];
