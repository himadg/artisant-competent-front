import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly http = inject(HttpClient);

  upload(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http
      .post<{ key: string }>('/storage/upload', formData)
      .pipe(map(r => r.key));
  }

  getSignedUrl(key: string, expiresIn = 900): Observable<string> {
    return this.http
      .post<{ url: string }>('/storage/signed-url', { key, operation: 'get', expiresIn })
      .pipe(map(r => r.url));
  }
}
