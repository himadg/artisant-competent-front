import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { FlashMessageService } from '../services/flash-message.service';

const STATUS_KEY_MAP: Record<number, string> = {
  400: 'errors.badRequest',
  403: 'errors.forbidden',
  404: 'errors.notFound',
  500: 'errors.server',
};

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const flash = inject(FlashMessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 géré par authInterceptor (refresh silencieux ou déconnexion)
      if (error.status === 401) return throwError(() => error);

      const key = STATUS_KEY_MAP[error.status] ?? (error.status === 0 ? 'errors.network' : 'errors.unknown');
      flash.set({ type: 'error', key });

      return throwError(() => error);
    }),
  );
};
