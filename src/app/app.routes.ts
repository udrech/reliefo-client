import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./views/layout/layout').then((m) => m.Layout),
  },
  {
    path: 'start',
    loadComponent: () => import('./views/start/start').then((m) => m.Start),
  },
];
