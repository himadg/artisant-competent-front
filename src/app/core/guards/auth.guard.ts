import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  // Ne jamais rediriger côté serveur : APP_INITIALIZER + hydration côté client gèrent la restauration de session.
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return true;

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) return true;

  await authService.loadCurrentUser();

  if (authService.isAuthenticated()) return true;

  return router.createUrlTree(['/auth/login']);
};

export const adminGuard: CanActivateFn = async () => {
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return true;

  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    await authService.loadCurrentUser();
  }

  if (authService.isAdmin()) return true;

  return router.createUrlTree(['/dashboard']);
};
