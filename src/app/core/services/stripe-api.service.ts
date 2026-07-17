import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StripeConnectAccount, StripeConnectStatus } from '../../shared/interfaces/stripe-connect';

@Injectable({ providedIn: 'root' })
export class StripeApiService {
  private readonly http = inject(HttpClient);

  createAccount(): Observable<StripeConnectAccount> {
    return this.http.post<StripeConnectAccount>('/stripe/connect/account', {});
  }

  createAccountSession(): Observable<{ clientSecret: string }> {
    return this.http.post<{ clientSecret: string }>('/stripe/connect/account-session', {});
  }

  getStatus(refresh = false): Observable<StripeConnectStatus> {
    return this.http.get<StripeConnectStatus>('/stripe/connect/status', {
      params: { refresh: String(refresh) },
    });
  }
}
