import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private config: Record<string, string> = {};

  async load(): Promise<void> {
    await fetch('/assets/config/config.json')
      .then(res => res.json())
      .then(cfg => { this.config = cfg; });
  }

  get(key: string): string {
    return this.config[key];
  }
}
