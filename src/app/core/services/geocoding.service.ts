import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

export interface AddressSuggestion {
  label: string;
  streetNumber: string;
  streetName: string;
  postalCode: string;
  city: string;
  latitude: number;
  longitude: number;
}

@Injectable({ providedIn: 'root' })
export class GeocodingService {
  private readonly baseUrl = '/addresses/geocode';

  constructor(private http: HttpClient) {}

  lookupCity(postalCode: string): Observable<string | null> {
    const params = new HttpParams().set('q', postalCode);
    return this.http.get<any>(this.baseUrl, { params }).pipe(
      map((res) => (res.features?.[0]?.properties?.city as string) ?? null),
      catchError(() => of(null)),
    );
  }

  search(query: string): Observable<AddressSuggestion[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<any>(this.baseUrl, { params }).pipe(
      map((res) =>
        (res.features ?? []).map((feature: any) => ({
          label: feature.properties.label as string,
          streetNumber: (feature.properties.housenumber ?? '') as string,
          streetName: ((feature.properties.street ?? feature.properties.name ?? '') as string).replace(/\s+/g, ' ').trim(),
          postalCode: (feature.properties.postcode ?? '') as string,
          city: (feature.properties.city ?? '') as string,
          latitude: feature.geometry.coordinates[1] as number,
          longitude: feature.geometry.coordinates[0] as number,
        })),
      ),
      catchError(() => of([])),
    );
  }
}
