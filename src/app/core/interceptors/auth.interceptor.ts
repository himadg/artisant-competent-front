import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/')) return next(req);

  const authService = inject(AuthService);

  // Les endpoints /auth/* utilisent le cookie refresh (withCredentials uniquement)
  const isAuthEndpoint = req.url.includes('/auth/');

  const token = authService.accessToken;
  const hadBearerToken = !isAuthEndpoint && !!token;
  const outgoing = hadBearerToken
    ? req.clone({ withCredentials: true, setHeaders: { Authorization: `Bearer ${token}` } })
    : req.clone({ withCredentials: true });

  return next(outgoing).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 sur un endpoint JWT protégé → tente un refresh silencieux puis rejoue la requête
      if (error.status === 401 && hadBearerToken) {
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
