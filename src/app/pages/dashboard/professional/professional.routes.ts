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
        path: 'missions',
        title: 'dashboard.sections.missions.title',
        loadComponent: () => import('./sections/missions/professional-missions-section').then((m) => m.ProfessionalMissionsSection),
      },
      {
        path: 'missions/:id',
        title: 'dashboard.sections.missions.detailTitle',
        loadComponent: () => import('../../../shared/components/mission-detail/mission-detail').then((m) => m.MissionDetailComponent),
      },
      {
        path: 'payments',
        title: 'dashboard.pro.nav.payments',
        loadComponent: () => import('./stripe-payments/stripe-payments-section').then((m) => m.StripePaymentsSection),
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
