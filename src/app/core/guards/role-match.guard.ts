import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Sélectionne la sous-arborescence de routes à charger selon le rôle de l'utilisateur connecté. */
export function roleMatch(...roles: string[]): CanMatchFn {
  return () => {
    const role = inject(AuthService).currentUser()?.role?.code;
    return !!role && roles.includes(role);
  };
}
