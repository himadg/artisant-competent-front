import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Quote, SaveQuoteDraftPayload } from '../../shared/interfaces/quote';

@Injectable({ providedIn: 'root' })
export class QuoteService {
  private readonly http = inject(HttpClient);

  /** Upsert : un seul brouillon actif par pro et par demande, sauvegarder met toujours à jour le même. */
  saveDraft(demandId: string, payload: SaveQuoteDraftPayload): Promise<Quote> {
    return firstValueFrom(this.http.put<Quote>(`/demands/${demandId}/quote`, payload));
  }

  /** `null` si aucun brouillon n'existe encore pour cette demande. */
  getDraft(demandId: string): Promise<Quote | null> {
    return firstValueFrom(this.http.get<Quote | null>(`/demands/${demandId}/quote`));
  }
}
