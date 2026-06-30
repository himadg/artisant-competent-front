import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

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
    path: 'espace-professionnel',
    title: 'pro.meta.title',
    loadComponent: () => import('./pages/professionnels/professionnels').then((p) => p.ProfessionnelsPageComponent),
  },
  {
    path: 'seo-batiment',
    title: 'seoBatiment.meta.title',
    loadComponent: () => import('./pages/seo-batiment/seo-batiment').then((p) => p.SeoBatimentPageComponent),
  },
  {
    path: 'jobs',
    title: 'jobs.title',
    loadComponent: () => import('./pages/jobs/jobs').then((p) => p.JobsPage),
  },
  { path: 'job', loadChildren: () => import('./pages/job/job.routes').then((r) => r.jobRoutes) },
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
    path: 'blog',
    title: 'blog.title',
    loadComponent: () => import('./pages/blog/blog').then((p) => p.BlogPage),
  },
  {
    path: 'faq',
    title: 'home.faq.title',
    loadComponent: () => import('./pages/faq/faq-page').then((p) => p.FaqPage),
  },
  {
    path: 'urgences',
    title: 'urgencesPage.title',
    loadComponent: () => import('./pages/urgences/urgences').then((p) => p.UrgencesPage),
  },
  {
    path: 'guidance',
    title: 'guidance.title',
    loadComponent: () => import('./pages/guidance/guidance').then((p) => p.GuidancePage),
  },
  {
    path: 'steps',
    title: 'steps.title',
    loadComponent: () => import('./pages/steps/steps').then((p) => p.StepsPage),
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
