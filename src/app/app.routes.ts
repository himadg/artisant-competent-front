import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'home.title',
    loadComponent: () => import('./pages/home/home').then((p) => p.HomePage),
  },
  { path: 'auth', loadChildren: () => import('./pages/auth/auth.routes').then((c) => c.authRoutes) },
  {
    path: 'dashboard',
    title: 'dashboard.title',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard').then((p) => p.DashboardPage),
  },
  {
    path: 'affiliation',
    title: 'affiliation.title',
    loadComponent: () => import('./pages/affiliation/affiliation').then((p) => p.AffiliationPage),
  },
  {
    path: 'jobs',
    title: 'jobs.title',
    loadComponent: () => import('./pages/jobs/jobs').then((p) => p.JobsPage),
  },
  {
    path: 'job',
    children: [
      { path: ':trade', loadComponent: () => import('./pages/job/job').then((c) => c.JobPage) },
      { path: ':trade/:city', loadComponent: () => import('./pages/job-city/job-city').then((c) => c.JobCityPage) },
    ],
  },
  {
    path: 'cities',
    title: 'cities.title',
    loadComponent: () => import('./pages/cities/cities').then((c) => c.CitiesPage),
  },
  {
    path: 'city/:city',
    loadComponent: () => import('./pages/city/city').then((c) => c.CityPage),
  },
  {
    path: 'contact',
    title: 'contact.title',
    loadComponent: () => import('./pages/contact/contact').then((p) => p.ContactPage),
  },
  {
    path: '**',
    title: 'not-found.title',
    loadComponent: () => import('./shared/components/not-found/not-found').then((c) => c.NotFound),
  },
];
