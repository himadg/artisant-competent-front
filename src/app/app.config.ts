import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
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
// Icons (ng-icons)
import { provideIcons } from '@ng-icons/core';
import { lucideSun, lucideMoon } from '@ng-icons/lucide';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideHttpClient(withInterceptorsFromDi()),
    provideTransloco(translocoConfig),
    { provide: TitleStrategy, useClass: TranslocoTitleStrategy },
    { provide: LOCALE_ID, useValue: 'fr' },
    ThemeService
  ],
};

// Enregistre les données de locale pour les pipes (date, currency, etc.)
registerLocaleData(localeFr);
