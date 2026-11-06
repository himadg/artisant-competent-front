import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PendingUser, RejectProfessionalPayload, RejectProfessionalResult } from '../../shared/interfaces/user';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);

  getPendingUsers(): Observable<PendingUser[]> {
    return this.http.get<PendingUser[]>('/admin/users/pending');
  }

  getUserDetails(id: string): Observable<any> {
    return this.http.get<any>(`/admin/users/${id}`);
  }

  approveUser(id: string): Observable<void> {
    return this.http.patch<void>(`/admin/users/${id}/status`, { status: 'ACTIVE' });
  }

  rejectProfessional(id: string, payload: RejectProfessionalPayload): Observable<RejectProfessionalResult> {
    return this.http.post<RejectProfessionalResult>(`/admin/users/${id}/reject`, payload);
  }
}
