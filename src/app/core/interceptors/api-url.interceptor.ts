import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AppConfigService } from '../services/app-config.service';

export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const apiUrl = inject(AppConfigService).get('apiUrl');

  if (!apiUrl || !req.url.startsWith('/')) return next(req);

  return next(req.clone({ url: `${apiUrl}${req.url}` }));
};
