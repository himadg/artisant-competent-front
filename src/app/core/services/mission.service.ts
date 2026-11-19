import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  MissionDetail,
  MissionDocuments,
  MissionFollowUpEntry,
  MissionSummary,
} from '../../shared/interfaces/mission';

const BASE_URL = '/missions';

@Injectable({ providedIn: 'root' })
export class MissionService {
  private readonly http = inject(HttpClient);

  getMine(): Promise<MissionSummary[]> {
    return firstValueFrom(this.http.get<MissionSummary[]>(`${BASE_URL}/mine`));
  }

  getById(id: string): Promise<MissionDetail> {
    return firstValueFrom(this.http.get<MissionDetail>(`${BASE_URL}/${id}`));
  }

  getFollowUp(id: string): Promise<MissionFollowUpEntry[]> {
    return firstValueFrom(this.http.get<MissionFollowUpEntry[]>(`${BASE_URL}/${id}/follow-up`));
  }

  createFollowUpEntry(id: string, dto: { date?: string; note?: string }): Promise<MissionFollowUpEntry> {
    return firstValueFrom(this.http.post<MissionFollowUpEntry>(`${BASE_URL}/${id}/follow-up`, dto));
  }

  updateFollowUpEntry(
    id: string,
    entryId: string,
    dto: { date?: string; note?: string },
  ): Promise<MissionFollowUpEntry> {
    return firstValueFrom(this.http.patch<MissionFollowUpEntry>(`${BASE_URL}/${id}/follow-up/${entryId}`, dto));
  }

  deleteFollowUpEntry(id: string, entryId: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE_URL}/${id}/follow-up/${entryId}`));
  }

  uploadFollowUpPhotos(id: string, entryId: string, files: File[]): Promise<MissionFollowUpEntry> {
    const form = new FormData();
    for (const file of files) form.append('files', file);
    return firstValueFrom(
      this.http.post<MissionFollowUpEntry>(`${BASE_URL}/${id}/follow-up/${entryId}/photos`, form),
    );
  }

  getDocuments(id: string): Promise<MissionDocuments> {
    return firstValueFrom(this.http.get<MissionDocuments>(`${BASE_URL}/${id}/documents`));
  }

  reportConflict(id: string, reason: string): Promise<{ id: string }> {
    return firstValueFrom(this.http.post<{ id: string }>(`${BASE_URL}/${id}/conflicts`, { reason }));
  }
}
