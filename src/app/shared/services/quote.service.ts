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
  clientSignatureUrl: string;
  prestataireSignatureUrl: string;
}

export type QuoteStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';

export interface QuoteListItem {
  id: string;
  quoteNumber: string;
  status: QuoteStatus;
  rejectionMessage: string | null;
  clientSignatureUrl?: string | null;
  prestataireSignatureUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  mission: {
    id: string;
    descriptif: string;
    lieu: string;
    trade: { id: string; name: string } | null;
    client?: { id: string; firstName: string; lastName: string; phone?: string; email?: string };
    professionals?: Array<{
      id: string;
      companyName: string;
      user: { firstName: string; lastName: string };
    }>;
  };
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

  getQuotesForClient(): Observable<QuoteListItem[]> {
    return this.http.get<QuoteListItem[]>(`${this.apiUrl}/quotes/client`);
  }

  getQuotesForProfessional(): Observable<QuoteListItem[]> {
    return this.http.get<QuoteListItem[]>(`${this.apiUrl}/quotes/professional`);
  }

  acceptQuote(quoteId: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/quotes/${quoteId}/accept`, {});
  }

  rejectQuote(quoteId: string, message?: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/quotes/${quoteId}/reject`, { message });
  }

  cancelQuote(quoteId: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/quotes/${quoteId}/cancel`, {});
  }
}
