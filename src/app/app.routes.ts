import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'start',
    loadComponent: () => import('./views/start/start').then((m) => m.Start),
  },
  {
    path: '',
    loadComponent: () => import('./views/layout/layout').then((m) => m.Layout),
    children: [
      {
        path: 'kunden',
        loadComponent: () =>
          import('./views/customers/customers-list/customers-list').then((m) => m.CustomersList),
      },
      {
        path: 'kunden/neu',
        loadComponent: () =>
          import('./views/customers/customers-form/customers-form').then((m) => m.CustomersForm),
      },
      {
        path: 'kunden/:id',
        loadComponent: () =>
          import('./views/customers/customers-detail/customers-detail').then((m) => m.CustomersDetail),
      },
      {
        path: 'kunden/:id/termine/neu',
        loadComponent: () =>
          import('./views/customers/appointments-form/appointments-form').then((m) => m.AppointmentsForm),
      },
      {
        path: 'kunden/:id/termine/:appointmentId/bearbeiten',
        loadComponent: () =>
          import('./views/customers/appointments-form/appointments-form').then((m) => m.AppointmentsForm),
      },
      {
        path: 'kunden/:id/bearbeiten',
        loadComponent: () =>
          import('./views/customers/customers-form/customers-form').then((m) => m.CustomersForm),
      },
      {
        path: 'termine',
        loadComponent: () =>
          import('./views/appointments/appointments-list/appointments-list').then((m) => m.AppointmentsList),
      },
      {
        path: 'quittungen',
        loadComponent: () =>
          import('./views/bills/bills-list/bills-list').then((m) => m.BillsList),
      },
      {
        path: 'massagen',
        loadComponent: () =>
          import('./views/therapies/therapies-list/therapies-list').then((m) => m.TherapiesList),
      },
      {
        path: 'massagen/neu',
        loadComponent: () =>
          import('./views/therapies/therapies-form/therapies-form').then((m) => m.TherapiesForm),
      },
      {
        path: 'massagen/:id/bearbeiten',
        loadComponent: () =>
          import('./views/therapies/therapies-form/therapies-form').then((m) => m.TherapiesForm),
      },
    ],
  },
];
