import { ApplicationConfig, inject, LOCALE_ID, PLATFORM_ID, TransferState, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { isPlatformBrowser, registerLocaleData } from '@angular/common';
import { AppConfigService } from './core/services/app-config.service';
import { AuthService } from './core/services/auth.service';
import { USER_STATE_KEY, ACCESS_TOKEN_STATE_KEY } from './core/state/auth-transfer';
import { provideRouter, withInMemoryScrolling, TitleStrategy } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { apiUrlInterceptor } from './core/interceptors/api-url.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import localeFr from '@angular/common/locales/fr';
import { routes } from './app.routes';

// i18n (Transloco)
import { provideTransloco } from '@jsverse/transloco';
import { translocoConfig } from './core/i18n/transloco.config';
import { TranslocoTitleStrategy } from './core/i18n/title.strategy';

// Thème, etc.
import { ThemeService } from './core/services/theme.service';

import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' })),
    provideHttpClient(withFetch(), withInterceptors([httpErrorInterceptor, authInterceptor, apiUrlInterceptor])),
    provideTransloco(translocoConfig),
    { provide: TitleStrategy, useClass: TranslocoTitleStrategy },
    { provide: LOCALE_ID, useValue: 'fr' },
    ThemeService,
    provideAppInitializer(async () => {
      const configService = inject(AppConfigService);
      const platformId = inject(PLATFORM_ID);
      const transferState = inject(TransferState);
      const auth = inject(AuthService);

      await configService.load();

      if (isPlatformBrowser(platformId)) {
        const user = transferState.get(USER_STATE_KEY, null);
        const token = transferState.get(ACCESS_TOKEN_STATE_KEY, null);
        if (user && token) {
          auth.setSession(token, user);
        } else {
          await auth.loadCurrentUser();
        }
      }
    }),
    provideClientHydration(withEventReplay()),
  ],
};

// Enregistre les données de locale pour les pipes (date, currency, etc.)
registerLocaleData(localeFr);
