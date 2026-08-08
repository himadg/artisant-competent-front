import { Routes } from '@angular/router';

export const professionalDashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shell/professional-dashboard-shell').then((m) => m.ProfessionalDashboardShell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'profile' },
      {
        path: 'profile',
        title: 'dashboard.sections.profile.title',
        loadComponent: () => import('./sections/profile/professional-profile-section').then((m) => m.ProfessionalProfileSection),
      },
      {
        path: 'requests',
        title: 'dashboard.sections.requests.title',
        loadComponent: () => import('./sections/requests/professional-requests-section').then((m) => m.ProfessionalRequestsSection),
      },
      {
        path: 'messages',
        title: 'dashboard.sections.messages.title',
        loadComponent: () => import('./sections/messages/professional-messages-section').then((m) => m.ProfessionalMessagesSection),
      },
      {
        path: 'practices',
        title: 'dashboard.sections.practices.title',
        loadComponent: () => import('./sections/practices/professional-practices-section').then((m) => m.ProfessionalPracticesSection),
      },
      {
        path: 'legal',
        title: 'dashboard.sections.legal.title',
        loadComponent: () => import('./sections/legal/professional-legal-section').then((m) => m.ProfessionalLegalSection),
      },
      {
        path: 'affiliation',
        title: 'dashboard.sections.affiliation.title',
        loadComponent: () => import('./sections/affiliation/professional-affiliation-section').then((m) => m.ProfessionalAffiliationSection),
      },
    ],
  },
];
