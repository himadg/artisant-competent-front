import { Injectable, PLATFORM_ID, inject, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthUser } from '../../shared/interfaces/user';

/** Marge prise avant l'expiration réelle du token pour déclencher le renouvellement proactif. */
const PROACTIVE_REFRESH_MARGIN_MS = 60_000;

function decodeJwtExpiryMs(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    const json = JSON.parse(atob(payload.replaceAll('-', '+').replaceAll('_', '/')));
    return typeof json.exp === 'number' ? json.exp * 1000 : null;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly _currentUser = signal<AuthUser | null>(null);
  private _accessToken: string | null = null;
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;
  /** Déduplique les refresh concurrents (ex: plusieurs requêtes en 401 en même temps) : un seul
   * appel réseau à /auth/refresh est en vol, les autres appelants attendent son résultat. */
  private refreshInFlight: Promise<string | null> | null = null;

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly isAdmin = computed(() => {
    const role = this._currentUser()?.role?.code;
    return role === 'ADMIN' || role === 'DIRECTION';
  });

  get accessToken(): string | null {
    return this._accessToken;
  }

  async login(email: string, password: string): Promise<void> {
    const { accessToken, user } = await firstValueFrom(
      this.http.post<{ accessToken: string; user: AuthUser }>('/auth/login', { email, password }),
    );
    this._accessToken = accessToken;
    this._currentUser.set(user);
    this.scheduleProactiveRefresh(accessToken);
  }

  async logout(): Promise<void> {
    await firstValueFrom(this.http.post<void>('/auth/logout', {})).catch(() => null);
    this.clearProactiveRefresh();
    this._accessToken = null;
    this._currentUser.set(null);
    this.router.navigate(['/']);
  }

  async loadCurrentUser(cookieHeader?: string): Promise<void> {
    try {
      const options = cookieHeader ? { headers: { Cookie: cookieHeader } } : {};
      const { accessToken, user } = await firstValueFrom(
        this.http.post<{ accessToken: string; user: AuthUser }>('/auth/refresh', {}, options),
      );
      this._accessToken = accessToken;
      this._currentUser.set(user);
      this.scheduleProactiveRefresh(accessToken);
    } catch {
      this._accessToken = null;
      this._currentUser.set(null);
    }
  }

  refreshTokens(): Promise<string | null> {
    if (this.refreshInFlight) return this.refreshInFlight;

    this.refreshInFlight = this.performRefresh().finally(() => {
      this.refreshInFlight = null;
    });
    return this.refreshInFlight;
  }

  private async performRefresh(): Promise<string | null> {
    try {
      const { accessToken, user } = await firstValueFrom(
        this.http.post<{ accessToken: string; user: AuthUser }>('/auth/refresh', {}),
      );
      this._accessToken = accessToken;
      this._currentUser.set(user);
      this.scheduleProactiveRefresh(accessToken);
      return accessToken;
    } catch {
      this.clearProactiveRefresh();
      this._accessToken = null;
      this._currentUser.set(null);
      this.router.navigate(['/auth/login']);
      return null;
    }
  }

  setSession(accessToken: string, user: AuthUser): void {
    this._accessToken = accessToken;
    this._currentUser.set(user);
    this.scheduleProactiveRefresh(accessToken);
  }

  setUser(user: AuthUser): void {
    this._currentUser.set(user);
  }

  setTempToken(token: string): void {
    this._accessToken = token;
  }

  /**
   * Programme un renouvellement du token avant son expiration réelle, pour éviter qu'une requête
   * ne parte avec un token déjà expiré (cas réactif géré par l'intercepteur en filet de sécurité,
   * ex: onglet resté en arrière-plan où les timers sont throttle par le navigateur).
   */
  private scheduleProactiveRefresh(accessToken: string): void {
    this.clearProactiveRefresh();
    if (!this.isBrowser) return;

    const expiryMs = decodeJwtExpiryMs(accessToken);
    if (expiryMs === null) return;

    const delay = expiryMs - Date.now() - PROACTIVE_REFRESH_MARGIN_MS;
    if (delay <= 0) return;

    this.refreshTimer = setTimeout(() => void this.refreshTokens(), delay);
  }

  private clearProactiveRefresh(): void {
    if (this.refreshTimer !== null) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
}
