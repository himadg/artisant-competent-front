import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

export interface AddressSuggestion {
  label: string;
  streetNumber: string;
  streetName: string;
  postalCode: string;
  city: string;
}

@Injectable({ providedIn: 'root' })
export class GeocodingService {
  private readonly baseUrl = 'https://api-adresse.data.gouv.fr/search/';

  constructor(private http: HttpClient) {}

  lookupCity(postalCode: string): Observable<string | null> {
    const params = new HttpParams().set('q', postalCode).set('limit', '1');
    return this.http.get<any>(this.baseUrl, { params }).pipe(
      map((res) => (res.features?.[0]?.properties?.city as string) ?? null),
      catchError(() => of(null)),
    );
  }

  search(query: string): Observable<AddressSuggestion[]> {
    const params = new HttpParams().set('q', query).set('limit', '5');
    return this.http.get<any>(this.baseUrl, { params }).pipe(
      map((res) =>
        (res.features ?? []).map((feature: any) => ({
          label: feature.properties.label as string,
          streetNumber: (feature.properties.housenumber ?? '') as string,
          streetName: ((feature.properties.street ?? feature.properties.name ?? '') as string).replace(/\s+/g, ' ').trim(),
          postalCode: (feature.properties.postcode ?? '') as string,
          city: (feature.properties.city ?? '') as string,
        })),
      ),
      catchError(() => of([])),
    );
  }
}
