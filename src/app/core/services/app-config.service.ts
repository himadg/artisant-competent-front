import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private config: Record<string, string> = {};
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  async load(): Promise<void> {
    if (!this.isBrowser) {
      const process = (globalThis as Record<string, unknown>)['process'] as NodeJS.Process | undefined;
      this.config = {
        apiUrl: process?.env?.['API_URL'] ?? '',
        turnstileSiteKey: process?.env?.['TURNSTILE_SITE_KEY'] ?? '',
      };
      return;
    }
    // Fetch réseau plutôt que TransferState : fonctionne peu importe le mode de rendu de la route
    // (SSR, prérendu, ou 100% client comme /auth/** et /dashboard/**), contrairement à TransferState
    // qui ne se remplit que pendant un vrai rendu serveur.
    await fetch('/assets/config/config.json')
      .then(res => res.json())
      .then(cfg => { this.config = cfg; });
  }

  get(key: string): string {
    return this.config[key];
  }
}
