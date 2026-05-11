import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.includes('/api')) return next(req);

  const authService = inject(AuthService);

  // Les endpoints /api/auth/* utilisent le cookie refresh (withCredentials uniquement)
  const isAuthEndpoint = req.url.includes('/api/auth/');

  const token = authService.accessToken;
  const outgoing = isAuthEndpoint || !token
    ? req.clone({ withCredentials: true })
    : req.clone({ withCredentials: true, setHeaders: { Authorization: `Bearer ${token}` } });

  return next(outgoing).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 sur un endpoint protégé → tente un refresh silencieux puis rejoue la requête
      if (error.status === 401 && !isAuthEndpoint) {
        return from(authService.refreshTokens()).pipe(
          switchMap((newToken) => {
            if (!newToken) return throwError(() => error);
            return next(req.clone({ withCredentials: true, setHeaders: { Authorization: `Bearer ${newToken}` } }));
          }),
        );
      }
      return throwError(() => error);
    }),
  );
};
