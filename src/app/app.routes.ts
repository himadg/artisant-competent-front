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
    path: 'jobs/electrician',
    title: 'jobs.list.electrician.name',
    loadComponent: () => import('./pages/job/electrician/electrician').then((c) => c.ElectricianPage),
  },
  {
    path: 'jobs/alarm-video-surveillance',
    title: 'jobs.list.alarmVideoSurveillance.name',
    loadComponent: () =>
      import('./pages/job/alarm-video-surveillance/alarm-video-surveillance').then((c) => c.AlarmVideoSurveillancePage),
  },
  {
    path: 'jobs/locksmith-metaller',
    title: 'jobs.list.locksmithMetaller.name',
    loadComponent: () =>
      import('./pages/job/locksmith-metaller/locksmith-metaller').then((c) => c.LocksmithMetallerPage),
  },
  {
    path: 'jobs/plumber-sanitary',
    title: 'jobs.list.plumberSanitary.name',
    loadComponent: () => import('./pages/job/plumber-sanitary/plumber-sanitary').then((c) => c.PlumberSanitaryPage),
  },
  {
    path: 'jobs/drain-unblocker',
    title: 'jobs.list.drainUnblocker.name',
    loadComponent: () => import('./pages/job/drain-unblocker/drain-unblocker').then((c) => c.DrainUnblockerPage),
  },
  {
    path: 'jobs/heating-tech',
    title: 'jobs.list.heatingTech.name',
    loadComponent: () => import('./pages/job/heating-tech/heating-tech').then((c) => c.HeatingTechPage),
  },
  {
    path: 'jobs/hvac-installer',
    title: 'jobs.list.hvacInstaller.name',
    loadComponent: () =>
      import('./pages/job/hvac-installer/hvac-installer').then((c) => c.HvacInstallerPage),
  },
  {
    path: 'jobs/carpenter-glazier',
    title: 'jobs.list.carpenterGlazier.name',
    loadComponent: () => import('./pages/job/carpenter-glazier/carpenter-glazier').then((c) => c.CarpenterGlazierPage),
  },
  {
    path: 'jobs/painter-interior-facade',
    title: 'jobs.list.painterInteriorFacade.name',
    loadComponent: () =>
      import('./pages/job/painter-interior-facade/painter-interior-facade').then((c) => c.PainterInteriorFacadePage),
  },
  {
    path: 'jobs/floor-coverings',
    title: 'jobs.list.floorCoverings.name',
    loadComponent: () => import('./pages/job/floor-coverings/floor-coverings').then((c) => c.FloorCoveringsPage),
  },
  {
    path: 'jobs/insulation-in-out',
    title: 'jobs.list.insulationInOut.name',
    loadComponent: () => import('./pages/job/insulation-in-out/insulation-in-out').then((c) => c.InsulationInOutPage),
  },
  {
    path: 'jobs/pest-control',
    title: 'jobs.list.pestControl.name',
    loadComponent: () => import('./pages/job/pest-control/pest-control').then((c) => c.PestControlPage),
  },
  {
    path: '**',
    title: 'not-found.title',
    loadComponent: () => import('./shared/components/not-found/not-found').then((c) => c.NotFound),
  },
];
