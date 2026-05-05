import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

export interface SiretResult {
  valid: boolean;
  companyName?: string;
  closed?: boolean;
}

@Injectable({ providedIn: 'root' })
export class SiretService {
  private readonly baseUrl = 'https://recherche-entreprises.api.gouv.fr/search';

  constructor(private http: HttpClient) {}

  verify(siret: string): Observable<SiretResult> {
    return this.http.get<any>(this.baseUrl, { params: { q: siret, page: '1', per_page: '1' } }).pipe(
      map((res) => {
        if (!res.total_results || res.total_results === 0) return { valid: false };
        const company = res.results[0];
        if (company.etat_administratif === 'F') return { valid: false, closed: true };
        return { valid: true, companyName: (company.nom_complet ?? company.siege?.denomination) as string };
      }),
      catchError(() => of({ valid: false })),
    );
  }
}
