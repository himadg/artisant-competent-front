import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PendingUser } from '../../shared/interfaces/pending-user';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);

  getPendingUsers(): Observable<PendingUser[]> {
    return this.http.get<PendingUser[]>('/admin/users/pending');
  }

  getUserDetails(id: string): Observable<any> {
    return this.http.get<any>(`/admin/users/${id}`);
  }

  updateUserStatus(id: string, status: 'ACTIVE' | 'REJECTED'): Observable<void> {
    return this.http.patch<void>(`/admin/users/${id}/status`, { status });
  }
}
