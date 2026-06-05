import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { User } from '../../shared/interfaces/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly _currentUser = signal<User | null>(null);
  private _accessToken: string | null = null;

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly isAdmin = computed(() => {
    const role = this._currentUser()?.role?.code;
    return role === 'ADMIN' || role === 'DIRECTION';
  });

  constructor() {
    if (this.isBrowser) {
      const storedUser = sessionStorage.getItem('user');
      const storedToken = sessionStorage.getItem('token');
      if (storedUser) {
        try {
          this._currentUser.set(JSON.parse(storedUser));
        } catch (e) {
          console.error('Error parsing stored user', e);
          sessionStorage.removeItem('user');
        }
      }
      if (storedToken) {
        this._accessToken = storedToken;
      }
    }
  }

  get accessToken(): string | null {
    if (!this._accessToken && this.isBrowser) {
      this._accessToken = sessionStorage.getItem('token');
    }
    return this._accessToken;
  }

  async login(email: string, password: string): Promise<void> {
    const { accessToken, user } = await firstValueFrom(
      this.http.post<{ accessToken: string; user: User }>('/auth/login', { email, password }),
    );
    this._accessToken = accessToken;
    this._currentUser.set(user);
    if (this.isBrowser) {
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('token', accessToken);
    }
  }

  async logout(): Promise<void> {
    await firstValueFrom(this.http.post<void>('/auth/logout', {})).catch(() => null);
    this._accessToken = null;
    this._currentUser.set(null);
    if (this.isBrowser) {
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
    }
    this.router.navigate(['/']);
  }

  async loadCurrentUser(): Promise<void> {
    try {
      const { accessToken, user } = await firstValueFrom(
        this.http.post<{ accessToken: string; user: User }>('/auth/refresh', {}),
      );
      this._accessToken = accessToken;
      this._currentUser.set(user);
      if (this.isBrowser) {
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('token', accessToken);
      }
    } catch {
      this._accessToken = null;
      this._currentUser.set(null);
      if (this.isBrowser) {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
      }
    }
  }

  async refreshTokens(): Promise<string | null> {
    try {
      const { accessToken, user } = await firstValueFrom(
        this.http.post<{ accessToken: string; user: User }>('/auth/refresh', {}),
      );
      this._accessToken = accessToken;
      this._currentUser.set(user);
      if (this.isBrowser) {
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('token', accessToken);
      }
      return accessToken;
    } catch {
      this._accessToken = null;
      this._currentUser.set(null);
      if (this.isBrowser) {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
      }
      this.router.navigate(['/auth/login']);
      return null;
    }
  }

  setSession(accessToken: string, user: User): void {
    this._accessToken = accessToken;
    this._currentUser.set(user);
    if (this.isBrowser) {
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('token', accessToken);
    }
  }

  setUser(user: User): void {
    this._currentUser.set(user);
    if (this.isBrowser) {
      sessionStorage.setItem('user', JSON.stringify(user));
    }
  }

  getCurrentUserId(): string | null {
    return this._currentUser()?.id || null;
  }

  setTempToken(token: string): void {
    this._accessToken = token;
  }
}
