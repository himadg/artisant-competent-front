import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { User } from '../../shared/interfaces/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _currentUser = signal<User | null>(null);
  private _accessToken: string | null = null;

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
      this.http.post<{ accessToken: string; user: User }>('/auth/login', { email, password }),
    );
    this._accessToken = accessToken;
    this._currentUser.set(user);
  }

  async logout(): Promise<void> {
    await firstValueFrom(this.http.post<void>('/auth/logout', {})).catch(() => null);
    this._accessToken = null;
    this._currentUser.set(null);
    this.router.navigate(['/']);
  }

  async loadCurrentUser(): Promise<void> {
    try {
      const { accessToken, user } = await firstValueFrom(
        this.http.post<{ accessToken: string; user: User }>('/auth/refresh', {}),
      );
      this._accessToken = accessToken;
      this._currentUser.set(user);
    } catch {
      this._accessToken = null;
      this._currentUser.set(null);
    }
  }

  async refreshTokens(): Promise<string | null> {
    try {
      const { accessToken, user } = await firstValueFrom(
        this.http.post<{ accessToken: string; user: User }>('/auth/refresh', {}),
      );
      this._accessToken = accessToken;
      this._currentUser.set(user);
      return accessToken;
    } catch {
      this._accessToken = null;
      this._currentUser.set(null);
      this.router.navigate(['/auth/login']);
      return null;
    }
  }

  setSession(accessToken: string, user: User): void {
    this._accessToken = accessToken;
    this._currentUser.set(user);
  }

  setUser(user: User): void {
    this._currentUser.set(user);
  }
}
