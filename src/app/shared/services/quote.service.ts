import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from '../../core/services/app-config.service';

export interface SignatureCoordinates {
  type: 'client' | 'prestataire';
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SignaturePdfResponse {
  pdfBase64: string;
  signatures: SignatureCoordinates[];
}

export interface SignatureUrlResponse {
  signatureUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private http = inject(HttpClient);
  private apiUrl = inject(AppConfigService).get('apiUrl');

  generatePdf(quoteData: any): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/pdf/generate-quote`, quoteData, {
      responseType: 'blob'
    });
  }

  generateSignaturePage(quoteData: any): Observable<SignaturePdfResponse> {
    return this.http.post<SignaturePdfResponse>(`${this.apiUrl}/pdf/generate-signature-page`, quoteData);
  }

  initiateSignature(quoteData: any): Observable<SignatureUrlResponse> {
    return this.http.post<SignatureUrlResponse>(`${this.apiUrl}/pdf/initiate-signature`, quoteData);
  }

  // Persist quote to backend
  createQuote(quoteData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/quotes`, quoteData);
  }

  updateQuote(quoteId: string, quoteData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/quotes/${quoteId}`, quoteData);
  }

  getQuote(quoteId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/quotes/${quoteId}`);
  }
}
