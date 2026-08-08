import { Routes } from '@angular/router';

/** Dashboard admin non (encore) découpé par section : une seule vue, quel que soit le segment. */
export const adminDashboardRoutes: Routes = [
  {
    path: '**',
    title: 'dashboard.title',
    loadComponent: () => import('./admin-dashboard').then((m) => m.AdminDashboard),
  },
];
