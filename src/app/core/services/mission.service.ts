import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';

export interface CreateMissionDto {
  descriptif: string;
  prestataireIds: string[];
  metierId: string;
  lieu: string;
  photoUrls?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private http = inject(HttpClient);
  private configService = inject(AppConfigService);
  private apiUrl = this.configService.get('apiUrl');

  createMission(data: CreateMissionDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/missions`, data);
  }

  getForProfessional(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/missions/professional`);
  }

  getForClient(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/missions/client`);
  }
}
