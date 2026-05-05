import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trade } from '../../shared/models/trade.model';

@Injectable({ providedIn: 'root' })
export class TradeApiService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Trade[]> {
    return this.http.get<Trade[]>('/api/trades');
  }
}
