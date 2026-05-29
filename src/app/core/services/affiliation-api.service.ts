import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AffiliationDashboard } from '../../shared/interfaces/affiliation';

@Injectable({ providedIn: 'root' })
export class AffiliationApiService {
  private readonly http = inject(HttpClient);

  generateCode(): Observable<{ code: string }> {
    return this.http.post<{ code: string }>('/affiliation/code', {});
  }

  getDashboard(): Observable<AffiliationDashboard> {
    return this.http.get<AffiliationDashboard>('/affiliation/dashboard');
  }
}
