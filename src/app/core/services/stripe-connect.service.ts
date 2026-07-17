import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { loadConnectAndInitialize, StripeConnectInstance } from '@stripe/connect-js';
import { AppConfigService } from './app-config.service';
import { StripeApiService } from './stripe-api.service';

// Singleton lazy : une seule instance Connect pour toute la session.
// fetchClientSecret est rappelé automatiquement par connect-js à l'expiration
// de la session — un refresh en plein onboarding reprend où il en était.
@Injectable({ providedIn: 'root' })
export class StripeConnectService {
  private readonly appConfig = inject(AppConfigService);
  private readonly stripeApi = inject(StripeApiService);
  private readonly transloco = inject(TranslocoService);
  private instance: StripeConnectInstance | null = null;

  getInstance(): StripeConnectInstance {
    if (!this.instance) {
      this.instance = loadConnectAndInitialize({
        publishableKey: this.appConfig.get('stripePublishableKey'),
        fetchClientSecret: async () => {
          const { clientSecret } = await firstValueFrom(this.stripeApi.createAccountSession());
          return clientSecret;
        },
        locale: this.transloco.getActiveLang() === 'en' ? 'en-GB' : 'fr-FR',
        appearance: {
          variables: {
            colorPrimary: '#00637b',
            borderRadius: '8px',
          },
        },
      });
    }
    return this.instance;
  }
}
