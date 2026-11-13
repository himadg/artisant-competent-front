import { Routes } from '@angular/router';
import { dashboardGuard } from './core/guards/auth.guard';
import { roleMatch } from './core/guards/role-match.guard';
import { comingSoonGuard } from './core/guards/coming-soon.guard';

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
    pathMatch: 'full',
    redirectTo: '/dashboard/profile',
  },
  {
    path: 'dashboard',
    canActivate: [dashboardGuard],
    data: { showHeader: false, showFooter: false },
    children: [
      {
        path: '',
        canMatch: [roleMatch('PROFESSIONAL')],
        loadChildren: () => import('./pages/dashboard/professional/professional.routes').then((r) => r.professionalDashboardRoutes),
      },
      {
        path: '',
        canMatch: [roleMatch('INDIVIDUAL')],
        loadChildren: () => import('./pages/dashboard/individual/individual.routes').then((r) => r.individualDashboardRoutes),
      },
      {
        path: '',
        canMatch: [roleMatch('ADMIN')],
        loadChildren: () => import('./pages/dashboard/admin/admin.routes').then((r) => r.adminDashboardRoutes),
      },
      {
        path: '**',
        loadComponent: () => import('./pages/dashboard/dashboard-fallback/dashboard-fallback').then((m) => m.DashboardFallback),
      },
    ],
  },
  // Chargée uniquement par Playwright lors de la génération PDF d'un devis (jamais par un
  // utilisateur) — pas de header/footer, authentification par jeton d'impression, pas de session.
  {
    path: 'print/quote/:quoteId',
    data: { showHeader: false, showFooter: false },
    loadComponent: () => import('./pages/print/quote-print/quote-print').then((p) => p.QuotePrintPage),
  },
  {
    path: 'about-us',
    title: 'home.presentation.title',
    loadComponent: () => import('./pages/about-us/about-us').then((p) => p.AboutUsPage),
  },
  {
    path: 'affiliation',
    title: 'affiliation.title',
    loadComponent: () => import('./pages/affiliation/affiliation').then((p) => p.AffiliationPage),
  },
  {
    path: 'pro-why-join-us',
    title: 'pro.meta.title',
    loadComponent: () => import('./pages/pro-why-join-us/pro-why-join-us').then((p) => p.ProWhyJoinUsPageComponent),
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
    canActivate: [comingSoonGuard],
    loadComponent: () => import('./pages/cmod-formule/cmod-formule').then((p) => p.CmodFormulePage),
  },
  {
    path: 'coming-soon',
    title: 'comingSoon.title',
    loadComponent: () => import('./shared/components/coming-soon/coming-soon').then((p) => p.ComingSoon),
  },
  // Pages légales : 5 routes, un même composant qui choisit son contenu selon `data.legalDoc`
  // (cf. legal-placeholder.ts) — contenu partagé avec les modales CGU/CGV/politiques.
  {
    path: 'terms-of-use',
    title: 'footer.legal.cgu',
    data: { legalDoc: 'cgu' },
    loadComponent: () => import('./pages/legal-placeholder/legal-placeholder').then((p) => p.LegalPlaceholderPage),
  },
  {
    path: 'terms-of-sale',
    title: 'footer.legal.cgv',
    data: { legalDoc: 'cgv' },
    loadComponent: () => import('./pages/legal-placeholder/legal-placeholder').then((p) => p.LegalPlaceholderPage),
  },
  {
    path: 'privacy-policy',
    title: 'footer.legal.privacy',
    data: { legalDoc: 'confidentialite' },
    loadComponent: () => import('./pages/legal-placeholder/legal-placeholder').then((p) => p.LegalPlaceholderPage),
  },
  {
    path: 'legal-notice',
    title: 'footer.legal.notice',
    data: { legalDoc: 'mentionsLegales' },
    loadComponent: () => import('./pages/legal-placeholder/legal-placeholder').then((p) => p.LegalPlaceholderPage),
  },
  {
    path: 'cookie-policy',
    title: 'footer.legal.cookies',
    data: { legalDoc: 'cookies' },
    loadComponent: () => import('./pages/legal-placeholder/legal-placeholder').then((p) => p.LegalPlaceholderPage),
  },
  {
    path: 'cancellation-policy',
    title: 'footer.legal.cancellation',
    data: { legalDoc: 'annulation' },
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
    path: 'search-pro',
    title: 'search.pageTitle',
    canActivate: [comingSoonGuard],
    loadComponent: () => import('./pages/search-pro/search-pro').then((p) => p.SearchProPage),
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
