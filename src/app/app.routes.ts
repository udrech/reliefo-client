import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'start',
    loadComponent: () => import('./views/start/start').then((m) => m.Start),
  },
  {
    path: 'home',
    loadComponent: () => import('./views/layout/layout').then((m) => m.Layout),
    children: [
      {
        path: 'kunden',
        loadComponent: () =>
          import('./views/customers-list/customers-list').then((m) => m.CustomersList),
      },
    ],
  },
];
