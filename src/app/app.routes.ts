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
    title: 'cookies.title',
    loadComponent: () => import('./pages/politique-cookies/politique-cookies').then((p) => p.PolitiqueCookiesPage),
  },
  {
    path: 'jobs/electrician',
    loadComponent: () => import('./pages/job/electrician/electrician').then((c) => c.ElectricianPage),
  },
  {
    path: 'jobs/alarm-video-surveillance',
    loadComponent: () =>
      import('./pages/job/alarm-video-surveillance/alarm-video-surveillance').then((c) => c.AlarmVideoSurveillancePage),
  },
  {
    path: 'jobs/locksmith-metaller',
    loadComponent: () =>
      import('./pages/job/locksmith-metaller/locksmith-metaller').then((c) => c.LocksmithMetallerPage),
  },
  {
    path: 'jobs/plumber-sanitary',
    loadComponent: () => import('./pages/job/plumber-sanitary/plumber-sanitary').then((c) => c.PlumberSanitaryPage),
  },
  {
    path: 'jobs/drain-unblocker',
    loadComponent: () => import('./pages/job/drain-unblocker/drain-unblocker').then((c) => c.DrainUnblockerPage),
  },
  {
    path: 'jobs/heating-tech',
    loadComponent: () => import('./pages/job/heating-tech/heating-tech').then((c) => c.HeatingTechPage),
  },
  {
    path: 'jobs/hvac-installer',
    loadComponent: () =>
      import('./pages/job/hvac-installer/hvac-installer').then((c) => c.HvacInstallerPage),
  },
  {
    path: 'jobs/carpenter-glazier',
    loadComponent: () => import('./pages/job/carpenter-glazier/carpenter-glazier').then((c) => c.CarpenterGlazierPage),
  },
  {
    path: 'jobs/painter-interior-facade',
    loadComponent: () =>
      import('./pages/job/painter-interior-facade/painter-interior-facade').then((c) => c.PainterInteriorFacadePage),
  },
  {
    path: 'jobs/floor-coverings',
    loadComponent: () => import('./pages/job/floor-coverings/floor-coverings').then((c) => c.FloorCoveringsPage),
  },
  {
    path: 'jobs/insulation-in-out',
    loadComponent: () => import('./pages/job/insulation-in-out/insulation-in-out').then((c) => c.InsulationInOutPage),
  },
  {
    path: 'jobs/pest-control',
    loadComponent: () => import('./pages/job/pest-control/pest-control').then((c) => c.PestControlPage),
  },
  {
    path: '**',
    title: 'not-found.title',
    loadComponent: () => import('./shared/components/not-found/not-found').then((c) => c.NotFound),
  },
];
