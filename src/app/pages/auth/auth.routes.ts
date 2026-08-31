import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const authRoutes: Routes = [
  { path: 'login', title: 'login.title', loadComponent: () => import('./login/login').then((c) => c.LoginPage) },
  {
    path: 'register',
    title: 'auth.register',
    loadComponent: () => import('./register/register').then((c) => c.RegisterPage),
  },
  {
    path: 'complete-registration',
    title: 'completeRegistration.title',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./complete-registration/complete-registration').then((c) => c.CompleteRegistrationPage),
  },
  {
    path: 'forgot-password',
    title: 'login.forgotPassword',
    loadComponent: () => import('./forgot-password/forgot-password').then((c) => c.ForgotPasswordPage),
  },
];
