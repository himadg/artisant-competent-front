import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  { path: 'login', loadComponent: () => import('./login/login').then((c) => c.LoginPage) },
  { path: 'register', loadComponent: () => import('./register/register').then((c) => c.RegisterPage) },
  {
    path: 'forgot-password',
    loadComponent: () => import('./forgot-password/forgot-password').then((c) => c.ForgotPasswordPage),
  },
];
