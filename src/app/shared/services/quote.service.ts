import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SignatureResponse {
  pdfBase64: string;
  signatures: {
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  generatePdf(quoteData: any): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/pdf/generate-quote`, quoteData, {
      responseType: 'blob'
    });
  }

  generateSignaturePage(quoteData: any): Observable<SignatureResponse> {
    // On attend maintenant un objet JSON en retour
    return this.http.post<SignatureResponse>(`${this.apiUrl}/pdf/generate-signature-page`, quoteData);
  }
}
