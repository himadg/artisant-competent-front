import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DocumentKeys {
  photoKey: string;
  idFrontKey: string;
  idBackKey: string;
  insuranceDocKey: string;
  decennialInsuranceDocKey: string;
  diplomaDocKey: string;
  companyLogoKey: string;
  ribKey: string;
  otherCertificationsKeys: string[];
}

type OpeningHoursUpdate = {
  days: { day: string; closed: boolean; intervals: { start: string; end: string }[] }[];
};

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private readonly http = inject(HttpClient);

  registerIndividual(
    payload: Record<string, unknown>,
    captchaToken: string,
  ): Observable<{ userId: string; accessToken: string; user: unknown }> {
    return this.http.post<{ userId: string; accessToken: string; user: unknown }>('/individuals', payload, {
      headers: { 'x-turnstile-token': captchaToken },
    });
  }

  createIndividualDocuments(userId: string, photoKey: string): Observable<void> {
    return this.http.patch<void>(`/individuals/${userId}/documents`, { photoKey });
  }

  updateUser(userId: string, data: Partial<{ firstName: string; lastName: string; email: string; birthDate: string; gender: string }>): Observable<void> {
    return this.http.patch<void>(`/users/${userId}`, data);
  }

  updateProfessional(userId: string, data: Partial<{
    companyName: string;
    description: string;
    trustedContactName: string | null;
    trustedContactPhone: string | null;
    tradeIds: string[];
    serviceIds: string[];
    suppliers: string[];
    openingHours: OpeningHoursUpdate;
  }>): Observable<void> {
    return this.http.patch<void>(`/professionals/${userId}`, data);
  }

  registerProfessional(
    payload: Record<string, unknown>,
    captchaToken: string,
  ): Observable<{ userId: string; accessToken: string; user: unknown; mailSent: boolean }> {
    return this.http.post<{ userId: string; accessToken: string; user: unknown; mailSent: boolean }>('/professionals', payload, {
      headers: { 'x-turnstile-token': captchaToken },
    });
  }

  createProfessionalDocuments(userId: string, documents: DocumentKeys): Observable<void> {
    return this.http.patch<void>(`/professionals/${userId}/documents`, documents);
  }

  getAllTrades(): Observable<{ id: string; name: string }[]> {
    return this.http.get<{ id: string; name: string }[]>('/trades');
  }

  searchServices(q: string): Observable<{ id: string; description: string }[]> {
    return this.http.get<{ id: string; description: string }[]>('/services/search', { params: { q } });
  }

  getUserProfile(userId: string): Observable<any> {
    return this.http.get<any>(`/users/${userId}`);
  }

  getProfessionalProfile(userId: string): Observable<any> {
    return this.http.get<any>(`/professionals/${userId}`);
  }

}
