import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfessionalProfile } from '../../shared/interfaces/professional-profile';

const BASE_URL = '/professionals';

@Injectable({
  providedIn: 'root',
})
export class ProfessionalService {
  private readonly http = inject(HttpClient);

  create(professional: Partial<ProfessionalProfile>, captchaToken: string): Observable<ProfessionalProfile> {
    return this.http.post<ProfessionalProfile>(BASE_URL, professional, {
      headers: { 'x-turnstile-token': captchaToken },
    });
  }

  list(params?: Record<string, any>): Observable<ProfessionalProfile[]> {
    return this.http.get<ProfessionalProfile[]>(BASE_URL, { params });
  }

  getById(id: string): Observable<ProfessionalProfile> {
    return this.http.get<ProfessionalProfile>(`${BASE_URL}/${id}`);
  }

  update(id: string, professional: ProfessionalProfile): Observable<ProfessionalProfile> {
    return this.http.patch<ProfessionalProfile>(`${BASE_URL}/${id}`, professional);
  }

  delete(id: string): Observable<ProfessionalProfile> {
    return this.http.delete<ProfessionalProfile>(`${BASE_URL}/${id}`);
  }
}
