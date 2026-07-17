import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CreateDemandResponse, DemandDetail, DemandSummary } from '../../shared/interfaces/demand';
import { LangService } from './lang.service';

const BASE_URL = '/demands';

@Injectable({ providedIn: 'root' })
export class DemandService {
  private readonly http = inject(HttpClient);
  private readonly langService = inject(LangService);

  create(description: string, professionalsId: string[]): Promise<CreateDemandResponse> {
    return firstValueFrom(
      this.http.post<CreateDemandResponse>(BASE_URL, {
        description,
        professionalsId,
        lang: this.langService.lang(),
      }),
    );
  }

  getMine(): Promise<DemandSummary[]> {
    return firstValueFrom(this.http.get<DemandSummary[]>(`${BASE_URL}/mine`));
  }

  getReceived(): Promise<DemandSummary[]> {
    return firstValueFrom(this.http.get<DemandSummary[]>(`${BASE_URL}/received`));
  }

  getById(id: string): Promise<DemandDetail> {
    return firstValueFrom(this.http.get<DemandDetail>(`${BASE_URL}/${id}`));
  }

  update(id: string, description: string): Promise<DemandDetail> {
    return firstValueFrom(this.http.patch<DemandDetail>(`${BASE_URL}/${id}`, { description }));
  }

  cancel(id: string): Promise<DemandDetail> {
    return firstValueFrom(this.http.patch<DemandDetail>(`${BASE_URL}/${id}/cancel`, {}));
  }

  /** `keepKeys` : clés des photos existantes à conserver (les autres sont supprimées). */
  uploadPhotos(id: string, files: File[], keepKeys?: string[]): Promise<DemandDetail> {
    const form = new FormData();
    for (const file of files) form.append('files', file);
    if (keepKeys) form.append('keepKeys', JSON.stringify(keepKeys));
    return firstValueFrom(this.http.post<DemandDetail>(`${BASE_URL}/${id}/photos`, form));
  }
}
