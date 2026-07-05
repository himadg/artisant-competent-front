import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type StoryType = 'PRESENTATION' | 'TIPS' | 'LIVE';

export interface Story {
  id: string;
  professionalProfileId: string;
  type: StoryType;
  videoKey: string;
  thumbnailKey: string | null;
  durationSeconds: number;
  createdAt: string;
  expiresAt: string;
}

export interface StoryFeedItem {
  id: string;
  type: StoryType;
  createdAt: string;
  professionalProfileId: string;
  companyName: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  avatarUrl: string | null;
}

@Injectable({ providedIn: 'root' })
export class StoryApiService {
  private readonly http = inject(HttpClient);

  upload(file: File, type: 'PRESENTATION' | 'TIPS'): Observable<Story> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return this.http.post<Story>('/stories', formData);
  }

  getMine(): Observable<Story[]> {
    return this.http.get<Story[]>('/stories/me');
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`/stories/${id}`);
  }

  getFeed(lat: number, lng: number, radius?: number, limit?: number): Observable<StoryFeedItem[]> {
    const params: Record<string, string> = { lat: String(lat), lng: String(lng) };
    if (radius) params['radius'] = String(radius);
    if (limit) params['limit'] = String(limit);
    return this.http.get<StoryFeedItem[]>('/stories/feed', { params });
  }
}
