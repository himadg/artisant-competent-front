import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

export interface SiretResult {
  valid: boolean;
  companyName?: string;
  closed?: boolean;
}

@Injectable({ providedIn: 'root' })
export class SiretService {
  constructor(private readonly http: HttpClient) {}

  verify(siret: string): Observable<SiretResult> {
    return this.http
      .get<SiretResult>(`/siret/${siret}`)
      .pipe(catchError(() => of({ valid: false })));
  }
}
