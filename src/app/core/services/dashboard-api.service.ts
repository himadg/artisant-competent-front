import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ProfessionalDashboardData } from '../../shared/interfaces/professional-dashboard';

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  private readonly http = inject(HttpClient);

  getOwnDashboard<T>(): Observable<T> {
    return this.http.get<T>('/api/dashboard');
  }

  getDashboard<T>(userId: string): Observable<T> {
    return this.http.get<T>(`/api/dashboard/${userId}`);
  }

  getSignedUrl(key: string): Observable<string> {
    return this.http
      .get<{ url: string }>('/api/dashboard/signed-url', { params: { key } })
      .pipe(map((r) => r.url));
  }
}
