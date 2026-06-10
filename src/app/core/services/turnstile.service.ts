import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AppConfigService } from './app-config.service';

/**
 * Service Cloudflare Turnstile en mode « execute » (widget invisible).
 *
 * Les tokens Turnstile sont à USAGE UNIQUE et le backend protège plusieurs
 * routes (upload de fichier + inscriptions) avec un TurnstileGuard. On a donc
 * besoin d'un token FRAIS à chaque appel : upload de chaque fichier, puis POST
 * d'inscription final.
 *
 * Conception : un seul widget invisible rendu une fois, réutilisé pour tous les
 * appels. `execute()` déclenche un challenge, résout avec le token, puis on
 * `reset()` le widget pour que le prochain `execute()` génère un nouveau token.
 *
 * SSR-safe : sur le serveur, `execute()` rejette sans toucher à `window`.
 */

// API Turnstile minimale exposée sur `window.turnstile`.
interface TurnstileApi {
  render(
    container: HTMLElement,
    options: {
      sitekey: string;
      size?: 'normal' | 'compact' | 'invisible' | 'flexible';
      callback?: (token: string) => void;
      'error-callback'?: (error?: unknown) => void;
      'expired-callback'?: () => void;
      execution?: 'render' | 'execute';
    },
  ): string;
  execute(widgetIdOrContainer: string | HTMLElement, options?: { sitekey?: string }): void;
  reset(widgetId?: string): void;
  remove(widgetId?: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    onloadTurnstileCallback?: () => void;
  }
}

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onloadTurnstileCallback';

@Injectable({ providedIn: 'root' })
export class TurnstileService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly siteKey = inject(AppConfigService).get('turnstileSiteKey');

  /** Promesse résolue quand le script + widget sont prêts. */
  private readyPromise: Promise<void> | null = null;
  private widgetId: string | null = null;
  private container: HTMLElement | null = null;

  /** Callbacks de l'`execute()` en cours. */
  private pendingResolve: ((token: string) => void) | null = null;
  private pendingReject: ((reason?: unknown) => void) | null = null;

  /**
   * Déclenche un challenge invisible et résout avec un token FRAIS.
   * Chaque appel génère un nouveau token (reset après usage).
   */
  async execute(): Promise<string> {
    if (!this.isBrowser) {
      return Promise.reject(new Error('Turnstile is not available during server-side rendering'));
    }

    await this.ensureReady();

    const turnstile = window.turnstile;
    if (!turnstile || this.widgetId === null) {
      throw new Error('Turnstile widget is not ready');
    }

    // Un seul execute à la fois : on rejette une demande concurrente précédente.
    if (this.pendingReject) {
      this.pendingReject(new Error('Turnstile execute superseded by a new call'));
      this.pendingResolve = null;
      this.pendingReject = null;
    }

    return new Promise<string>((resolve, reject) => {
      this.pendingResolve = resolve;
      this.pendingReject = reject;
      try {
        // Reset pour garantir un token neuf, puis lancement du challenge.
        turnstile.reset(this.widgetId!);
        turnstile.execute(this.widgetId!, { sitekey: this.siteKey });
      } catch (err) {
        this.pendingResolve = null;
        this.pendingReject = null;
        reject(err);
      }
    });
  }

  /** Charge le script (une fois) et rend le widget invisible (une fois). */
  private ensureReady(): Promise<void> {
    if (this.readyPromise) return this.readyPromise;

    this.readyPromise = new Promise<void>((resolve, reject) => {
      const renderWidget = () => {
        try {
          const turnstile = window.turnstile;
          if (!turnstile) {
            reject(new Error('Turnstile script loaded but window.turnstile is undefined'));
            return;
          }

          // Conteneur invisible attaché au DOM (Turnstile exige un élément monté).
          const container = document.createElement('div');
          container.style.display = 'none';
          document.body.appendChild(container);
          this.container = container;

          this.widgetId = turnstile.render(container, {
            sitekey: this.siteKey,
            size: 'invisible',
            execution: 'execute',
            callback: (token: string) => {
              const r = this.pendingResolve;
              this.pendingResolve = null;
              this.pendingReject = null;
              r?.(token);
            },
            'error-callback': (error?: unknown) => {
              const rj = this.pendingReject;
              this.pendingResolve = null;
              this.pendingReject = null;
              rj?.(error ?? new Error('Turnstile challenge failed'));
            },
            'expired-callback': () => {
              // Token expiré avant consommation : on laisse le prochain execute() reset.
            },
          });
          resolve();
        } catch (err) {
          reject(err);
        }
      };

      // Si l'API est déjà disponible, on rend directement.
      if (window.turnstile) {
        renderWidget();
        return;
      }

      // Sinon on charge le script et on attend le callback global onload.
      const existing = document.querySelector<HTMLScriptElement>(`script[src^="https://challenges.cloudflare.com/turnstile"]`);
      window.onloadTurnstileCallback = renderWidget;

      if (existing) {
        // Script déjà présent mais pas encore initialisé : le callback s'en chargera.
        return;
      }

      const script = document.createElement('script');
      script.src = SCRIPT_URL;
      script.async = true;
      script.defer = true;
      script.onerror = () => reject(new Error('Failed to load Cloudflare Turnstile script'));
      document.head.appendChild(script);
    });

    return this.readyPromise;
  }
}
