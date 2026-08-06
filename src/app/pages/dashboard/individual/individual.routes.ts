import { Routes } from '@angular/router';

export const individualDashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shell/individual-dashboard-shell').then((m) => m.IndividualDashboardShell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'profile' },
      {
        path: 'profile',
        title: 'dashboard.sections.profile.title',
        loadComponent: () => import('./sections/profile/individual-profile-section').then((m) => m.IndividualProfileSection),
      },
      {
        path: 'requests',
        title: 'dashboard.sections.requests.title',
        loadComponent: () => import('./sections/requests/individual-requests-section').then((m) => m.IndividualRequestsSection),
      },
      {
        path: 'messages',
        title: 'dashboard.sections.messages.title',
        loadComponent: () => import('./sections/messages/individual-messages-section').then((m) => m.IndividualMessagesSection),
      },
      {
        path: 'practices',
        title: 'dashboard.sections.practices.title',
        loadComponent: () => import('./sections/practices/individual-practices-section').then((m) => m.IndividualPracticesSection),
      },
      {
        path: 'legal',
        title: 'dashboard.sections.legal.title',
        loadComponent: () => import('./sections/legal/individual-legal-section').then((m) => m.IndividualLegalSection),
      },
      {
        path: 'affiliation',
        title: 'dashboard.sections.affiliation.title',
        loadComponent: () => import('./sections/affiliation/individual-affiliation-section').then((m) => m.IndividualAffiliationSection),
      },
      // 'quotes'/'invoices' existaient dans l'ancien type IndividualSection mais ne sont reliés à
      // aucun déclencheur UI (fonctionnalités pas encore livrées) — volontairement non routés.
    ],
  },
];
