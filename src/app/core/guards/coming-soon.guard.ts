import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppConfigService } from '../services/app-config.service';

export const comingSoonGuard: CanActivateFn = () => {
  const configService = inject(AppConfigService);

  if (configService.get('comingSoonEnabled') !== 'true') return true;

  return inject(Router).createUrlTree(['/coming-soon']);
};
