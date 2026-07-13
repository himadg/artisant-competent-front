import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CreateDemandResponse } from '../../shared/interfaces/demand';

const BASE_URL = '/demands';

@Injectable({ providedIn: 'root' })
export class DemandService {
  private readonly http = inject(HttpClient);

  create(description: string, professionalsId: string[]): Promise<CreateDemandResponse> {
    return firstValueFrom(
      this.http.post<CreateDemandResponse>(BASE_URL, { description, professionalsId }),
    );
  }

  uploadPhotos(id: string, files: File[]): Promise<void> {
    const form = new FormData();
    for (const file of files) form.append('files', file);
    return firstValueFrom(this.http.post<void>(`${BASE_URL}/${id}/photos`, form));
  }
}
