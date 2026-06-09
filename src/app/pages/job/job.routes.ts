import { Routes } from '@angular/router';

export const jobRoutes: Routes = [
  { path: 'electrician', loadComponent: () => import('./electrician/electrician').then((c) => c.ElectricianPage) },
  { path: 'locksmith', loadComponent: () => import('./locksmith/locksmith').then((c) => c.LocksmithPage) },
  { path: 'plumber-sanitary', loadComponent: () => import('./plumber-sanitary/plumber-sanitary').then((c) => c.PlumberSanitaryPage) },
  { path: 'drain-unblocker', loadComponent: () => import('./drain-unblocker/drain-unblocker').then((c) => c.DrainUnblockerPage) },
  { path: 'heating', loadComponent: () => import('./heating/heating').then((c) => c.HeatingPage) },
  { path: 'hvac', loadComponent: () => import('./hvac/hvac').then((c) => c.HvacPage) },
  { path: 'glazier', loadComponent: () => import('./glazier/glazier').then((c) => c.GlazierPage) },
  { path: 'pest-control', loadComponent: () => import('./pest-control/pest-control').then((c) => c.PestControlPage) },
  { path: ':trade/:city', loadComponent: () => import('../job-city/job-city').then((c) => c.JobCityPage) },
];
