import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'home.meta.title',
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
    path: 'cmod/formule',
    title: 'cmodFormule.title',
    loadComponent: () => import('./pages/cmod-formule/cmod-formule').then((p) => p.CmodFormulePage),
  },
  // Pages légales : 5 routes pointent toutes vers le même composant placeholder.
  // TODO_HIMAD: contenu définitif à fournir pour chaque page.
  {
    path: 'cgu',
    title: 'footer.legal.cgu',
    loadComponent: () => import('./pages/legal-placeholder/legal-placeholder').then((p) => p.LegalPlaceholderPage),
  },
  {
    path: 'cgv',
    title: 'footer.legal.cgv',
    loadComponent: () => import('./pages/legal-placeholder/legal-placeholder').then((p) => p.LegalPlaceholderPage),
  },
  {
    path: 'politique-confidentialite',
    title: 'footer.legal.privacy',
    loadComponent: () => import('./pages/legal-placeholder/legal-placeholder').then((p) => p.LegalPlaceholderPage),
  },
  {
    path: 'mentions-legales',
    title: 'footer.legal.notice',
    loadComponent: () => import('./pages/legal-placeholder/legal-placeholder').then((p) => p.LegalPlaceholderPage),
  },
  {
    path: 'politique-cookies',
    title: 'footer.legal.cookies',
    loadComponent: () => import('./pages/legal-placeholder/legal-placeholder').then((p) => p.LegalPlaceholderPage),
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
    path: 'search-pro-results',
    loadComponent: () => import('./pages/search-pro-results/search-pro-results').then((p) => p.SearchProResultsPage),
  },
  {
    path: 'contact',
    title: 'contact.title',
    loadComponent: () => import('./pages/contact/contact').then((p) => p.ContactPage),
  },
  {
    path: 'quote-form',
    title: 'quote-form.title',
    loadComponent: () => import('./pages/quote-form/quote-form-page.component').then((c) => c.QuoteFormPageComponent),
  },
  {
    path: '**',
    title: 'not-found.title',
    loadComponent: () => import('./shared/components/not-found/not-found').then((c) => c.NotFound),
  },
];
