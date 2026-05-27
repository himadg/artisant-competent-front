import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from '../../core/services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private http = inject(HttpClient);
  private apiUrl = inject(AppConfigService).get('apiUrl');

  generatePdf(quoteData: any): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/api/pdf/generate-quote`, quoteData, {
      responseType: 'blob'
    });
  }
}
