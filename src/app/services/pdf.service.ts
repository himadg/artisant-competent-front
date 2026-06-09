import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private http = inject(HttpClient);

  // Pointe vers le StorageController de NestJS
  private apiUrl = '/api/storage';

  uploadPdf(file: File): Observable<{ key: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ key: string }>(`${this.apiUrl}/upload`, formData);
  }

  getPdfUrl(key: string): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.apiUrl}/${key}/url`);
  }
}
