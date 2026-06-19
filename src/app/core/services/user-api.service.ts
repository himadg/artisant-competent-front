import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentKeys } from '../../shared/interfaces/document-keys';

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

  updateUser(userId: string, data: Partial<{
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    gender: string;
    address: { streetNumber: string; streetName: string; additionalInfo: string | null; postalCode: string; city: string };
  }>): Observable<void> {
    return this.http.patch<void>(`/users/${userId}`, data);
  }

  updateProfessional(userId: string, data: Partial<{
    companyName: string;
    description: string;
    managerPhone: string;
    professionalEmail: string | null;
    trustedContactName: string | null;
    trustedContactPhone: string | null;
    tradeIds: string[];
    serviceIds: string[];
    suppliers: string[];
    openingHours: OpeningHoursUpdate;
    yearsExperience: number;
    onCall: boolean;
    workAddress: { streetNumber: string; streetName: string; additionalInfo: string | null; postalCode: string; city: string };
    mediatorName: string | null;
    mediatorAddress: string | null;
    mediatorWebsite: string | null;
    mediatorContactMethod: string | null;
    mediatorAdditionalInfo: string | null;
    additionalRemarks: string | null;
    companyRemarks: string | null;
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

}
