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
        path: '',
        redirectTo: 'kunden',
        pathMatch: 'full',
      },
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
        path: 'kunden/:id/bearbeiten',
        loadComponent: () =>
          import('./views/customers/customers-form/customers-form').then((m) => m.CustomersForm),
      },
      {
        path: 'kunden/:id/krankengeschichte/neu',
        loadComponent: () =>
          import('./views/customers/medicalhistoryrecords-form/medicalhistoryrecords-form').then((m) => m.MedicalhistoryrecordsForm),
      },
      {
        path: 'kunden/:id/krankengeschichte/:mid/bearbeiten',
        loadComponent: () =>
          import('./views/customers/medicalhistoryrecords-form/medicalhistoryrecords-form').then((m) => m.MedicalhistoryrecordsForm),
      },
      {
        path: 'kunden/:id/termine/neu',
        loadComponent: () =>
          import('./views/customers/appointments-form/appointments-form').then((m) => m.AppointmentsForm),
      },
      {
        path: 'kunden/:id/termine/:aid/bearbeiten',
        loadComponent: () =>
          import('./views/customers/appointments-form/appointments-form').then((m) => m.AppointmentsForm),
      },
      {
        path: 'kunden/:id',
        loadComponent: () =>
          import('./views/customers/customers-detail/customers-detail').then((m) => m.CustomersDetail),
        children: [
          {
            path: '',
            redirectTo: 'kunde',
            pathMatch: 'full',
          },
          {
            path: 'kunde',
            loadComponent: () =>
              import('./views/customers/customers-info/customers-info').then((m) => m.CustomersInfo),
          },
          {
            path: 'termine',
            loadComponent: () =>
              import('./views/customers/appointments-list/appointments-list').then((m) => m.AppointmentsList),
          },
          {
            path: 'quittungen',
            loadComponent: () =>
              import('./views/customers/bills-list/bills-list').then((m) => m.BillsList),
          },
          {
            path: 'krankengeschichte',
            loadComponent: () =>
              import('./views/customers/medicalhistoryrecords-list/medicalhistoryrecords-list').then((m) => m.MedicalhistoryrecordsList),
          },
        ],
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
        path: 'quittungen/:id',
        loadComponent: () =>
          import('./views/bills/bills-detail/bills-detail').then((m) => m.BillsDetail),
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
