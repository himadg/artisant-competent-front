import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DashboardApiService } from './dashboard-api.service';

/**
 * Centralise le chargement des données de dashboard (un seul appel HTTP réutilisé, quel que soit
 * le nombre de composants qui le demandent) : préparé pour l'étape 2 (composants par section), qui
 * pourront chacun injecter ce service sans provoquer un nouvel appel réseau.
 */
@Injectable({ providedIn: 'root' })
export class DashboardDataService {
  private readonly api = inject(DashboardApiService);
  private readonly cache = new Map<string, Promise<unknown>>();

  loadOwn<T>(): Promise<T> {
    return this.loadCached('own', () => firstValueFrom(this.api.getOwnDashboard<T>()));
  }

  loadFor<T>(userId: string): Promise<T> {
    return this.loadCached(userId, () => firstValueFrom(this.api.getDashboard<T>(userId)));
  }

  /** À appeler après une mutation qui rend les données en cache obsolètes. */
  invalidate(key = 'own'): void {
    this.cache.delete(key);
  }

  private loadCached<T>(key: string, fetch: () => Promise<T>): Promise<T> {
    if (!this.cache.has(key)) {
      this.cache.set(key, fetch());
    }
    return this.cache.get(key) as Promise<T>;
  }
}
