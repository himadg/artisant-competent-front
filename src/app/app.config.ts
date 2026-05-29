import { ApplicationConfig, inject, LOCALE_ID, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { AppConfigService } from './core/services/app-config.service';
import { provideRouter, withInMemoryScrolling, TitleStrategy } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { apiUrlInterceptor } from './core/interceptors/api-url.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import { routes } from './app.routes';

// i18n (Transloco)
import { provideTransloco } from '@jsverse/transloco';
import { translocoConfig } from './core/i18n/transloco.config';
import { TranslocoTitleStrategy } from './core/i18n/title.strategy';

// Thème, etc.
import { ThemeService } from './core/services/theme.service';

// Icons (ng-icons)
import { provideIcons } from '@ng-icons/core';
import { lucideSun, lucideMoon } from '@ng-icons/lucide';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, apiUrlInterceptor])),
    provideTransloco(translocoConfig),
    { provide: TitleStrategy, useClass: TranslocoTitleStrategy },
    { provide: LOCALE_ID, useValue: 'fr' },
    ThemeService,
    provideAppInitializer(() => inject(AppConfigService).load()),
    provideIcons({
      lucideSun,
      lucideMoon,
    }),
    provideClientHydration(withEventReplay()),
  ],
};

// Enregistre les données de locale pour les pipes (date, currency, etc.)
registerLocaleData(localeFr);
