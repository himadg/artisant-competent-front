import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DocumentKeys {
  photoKey: string;
  idFrontKey: string;
  idBackKey: string;
  insuranceDocKey: string;
  diplomaDocKey: string;
  companyLogoKey: string;
  ribKey: string;
}

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private readonly http = inject(HttpClient);

  registerProfessional(
    payload: Record<string, unknown>,
    captchaToken: string,
  ): Observable<{ userId: string; token: string }> {
    return this.http.post<{ userId: string; token: string }>('/api/professionals', payload, {
      headers: { 'x-turnstile-token': captchaToken },
    });
  }

  createProfessionalDocuments(userId: string, documents: DocumentKeys, token: string): Observable<void> {
    return this.http.patch<void>(`/api/professionals/${userId}/documents`, documents, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
