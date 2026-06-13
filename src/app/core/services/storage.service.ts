import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import { TurnstileService } from './turnstile.service';

// Chemin relatif : l'apiUrlInterceptor préfixe automatiquement par apiUrl.
const BASE_URL = '/storage';

export interface UploadResponse {
  key: string;
}

export interface SignedUrlResponse {
  url: string;
}

/**
 * Service d'upload de fichiers.
 *
 * Le backend reçoit le binaire (multipart, champ `file`) et renvoie une clé
 * unique (`{ key }`). Cette clé est ce qui est stocké côté formulaire et envoyé
 * au reste de l'API (photoKey, idFrontKey, ...). Pour réafficher un fichier déjà
 * uploadé, on demande une URL signée via `getUrl(key)`.
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly http = inject(HttpClient);
  private readonly turnstile = inject(TurnstileService);

  /**
   * Envoie le binaire et récupère la clé générée par le backend.
   *
   * Le backend protège `POST /storage/upload` avec un TurnstileGuard, et les
   * tokens Turnstile sont à usage unique : on génère donc un token FRAIS pour
   * chaque upload (`TurnstileService.execute()`) et on l'envoie dans l'en-tête
   * `x-turnstile-token`.
   */
  upload(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return from(this.turnstile.execute()).pipe(
      switchMap((token) =>
        this.http.post<UploadResponse>(`${BASE_URL}/upload`, formData, {
          headers: { 'x-turnstile-token': token },
        }),
      ),
    );
  }

  /** Récupère une URL signée (valide 1h) pour prévisualiser/télécharger un fichier. */
  getUrl(key: string): Observable<SignedUrlResponse> {
    return this.http.get<SignedUrlResponse>(`${BASE_URL}/${encodeURIComponent(key)}/url`);
  }

  /**
   * Télécharge le binaire d'un fichier déjà uploadé, servi par notre propre
   * backend (same-origin). À privilégier pour un `fetch()`/blob côté navigateur :
   * l'URL signée pointe vers Backblaze et serait bloquée par CORS si le bucket
   * n'expose pas de règle adéquate. Ici, pas de souci CORS.
   */
  getContent(key: string): Observable<Blob> {
    const path = key
      .split('/')
      .map((segment) => encodeURIComponent(segment))
      .join('/');
    return this.http.get(`${BASE_URL}/content/${path}`, { responseType: 'blob' });
  }
}
