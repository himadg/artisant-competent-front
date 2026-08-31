import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

async function ensureAuthenticated(): Promise<true | UrlTree> {
  // Ne jamais rediriger côté serveur : APP_INITIALIZER + hydration côté client gèrent la restauration de session.
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return true;

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) return true;

  await authService.loadCurrentUser();

  if (authService.isAuthenticated()) return true;

  return router.createUrlTree(['/auth/login']);
}

export const authGuard: CanActivateFn = () => ensureAuthenticated();

/** Comme authGuard, mais bloque en plus l'accès au dashboard tant qu'un compte pro créé est resté
 * INCOMPLETE (étape 2 de l'inscription — envoi des documents — jamais aboutie), pour le renvoyer
 * vers l'écran de reprise plutôt qu'un accès partiel/confus au dashboard. */
export const dashboardGuard: CanActivateFn = async () => {
  // inject() doit s'exécuter de façon strictement synchrone dans le contexte d'injection de la
  // garde : on récupère tout AVANT le moindre `await`, jamais après (sinon NG0203 — la reprise
  // post-await se fait hors contexte d'injection).
  const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  const authService = inject(AuthService);
  const router = inject(Router);

  const authResult = await ensureAuthenticated();
  if (authResult !== true) return authResult;

  if (!isBrowser) return true;

  if (authService.currentUser()?.status === 'INCOMPLETE') {
    return router.createUrlTree(['/auth/complete-registration']);
  }

  return true;
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
