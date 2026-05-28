import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Service } from '../../shared/interfaces/service';

const BASE_URL = '/api/services';

@Injectable({ providedIn: 'root' })
export class ServiceApiService {
  private readonly http = inject(HttpClient);

  search(query: string): Observable<Service[]> {
    return this.http.get<Service[]>(`${BASE_URL}/search`, { params: { q: query } });
  }

  create(description: string): Observable<Service> {
    return this.http.post<Service>(BASE_URL, { description });
  }

  getAll(): Observable<Service[]> {
    return this.http.get<Service[]>(BASE_URL);
  }
}
