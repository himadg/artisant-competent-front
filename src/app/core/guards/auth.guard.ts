import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) return true;

  // Tente de récupérer la session depuis le cookie
  await authService.loadCurrentUser();

  if (authService.isAuthenticated()) return true;

  return router.createUrlTree(['/auth/login']);
};

export const adminGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    await authService.loadCurrentUser();
  }

  if (authService.isAdmin()) return true;

  return router.createUrlTree(['/dashboard']);
};
