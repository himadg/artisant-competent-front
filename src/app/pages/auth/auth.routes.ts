import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  { path: 'login', title: 'login.title', loadComponent: () => import('./login/login').then((c) => c.LoginPage) },
  {
    path: 'register',
    title: 'auth.register',
    loadComponent: () => import('./register/register').then((c) => c.RegisterPage),
  },
  {
    path: 'forgot-password',
    title: 'login.forgotPassword',
    loadComponent: () => import('./forgot-password/forgot-password').then((c) => c.ForgotPasswordPage),
  },
];
