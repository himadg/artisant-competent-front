import { ApplicationConfig, inject, LOCALE_ID, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { AppConfigService } from './core/services/app-config.service';
import { provideRouter, withInMemoryScrolling, TitleStrategy } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import { routes } from './app.routes';

// i18n (Transloco)
import { provideTransloco } from '@jsverse/transloco';
import { translocoConfig } from './core/i18n/transloco.config';
import { TranslocoTitleStrategy } from './core/i18n/title.strategy';

// Thème, etc.
import { ThemeService } from './core/services/theme.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideHttpClient(withInterceptorsFromDi()),
    provideTransloco(translocoConfig),
    { provide: TitleStrategy, useClass: TranslocoTitleStrategy },
    { provide: LOCALE_ID, useValue: 'fr' },
    ThemeService,
    provideAppInitializer(() => inject(AppConfigService).load()),
  ],
};

// Enregistre les données de locale pour les pipes (date, currency, etc.)
registerLocaleData(localeFr);
