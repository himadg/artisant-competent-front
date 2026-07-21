import { mergeApplicationConfig, ApplicationConfig, REQUEST, TransferState, inject, provideAppInitializer } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { AppConfigService } from './core/services/app-config.service';
import { AuthService } from './core/services/auth.service';
import { USER_STATE_KEY, ACCESS_TOKEN_STATE_KEY } from './core/state/auth-transfer';
import { User } from './shared/interfaces/user';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    provideAppInitializer(async () => {
      const configService = inject(AppConfigService);
      const request = inject(REQUEST, { optional: true });
      const auth = inject(AuthService);
      const transferState = inject(TransferState);

      await configService.load();

      const cookieHeader = request?.headers.get('cookie') ?? '';
      const apiUrl = configService.get('apiUrl');

      // Utilise fetch natif (hors HttpClient) pour ne pas créer de PendingTask Zone.js
      if (cookieHeader && apiUrl) {
        try {
          const res = await fetch(`${apiUrl}/auth/refresh`, {
            method: 'POST',
            headers: { Cookie: cookieHeader, 'Content-Type': 'application/json' },
            body: '{}',
          });
          if (res.ok) {
            const { accessToken, user } = await res.json() as { accessToken: string; user: User };
            auth.setSession(accessToken, user);
          }
        } catch { /* backend injoignable ou token expiré, on laisse l'user non connecté */ }
      }

      transferState.set(USER_STATE_KEY, auth.currentUser());
      transferState.set(ACCESS_TOKEN_STATE_KEY, auth.accessToken);
    }),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
