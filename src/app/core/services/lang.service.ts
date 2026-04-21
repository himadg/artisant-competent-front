import { Injectable, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

type Lang = 'fr' | 'en';

@Injectable({ providedIn: 'root' })
export class LangService {
  private readonly storageKey = 'lang';
  private readonly isBrowser = typeof window !== 'undefined';

  readonly lang = signal<Lang>('fr');

  constructor(private readonly transloco: TranslocoService) {
    const saved = this.isBrowser ? (localStorage.getItem(this.storageKey) as Lang | null) : null;
    const initial = saved && this.isValid(saved) ? saved : 'fr';
    this.lang.set(initial);
    this.transloco.setActiveLang(initial);
  }

  setLang(next: Lang) {
    if (!this.isValid(next)) return;
    this.lang.set(next);
    if (this.isBrowser) localStorage.setItem(this.storageKey, next);
    this.transloco.setActiveLang(next);
  }

  toggle() {
    const next: Lang = this.lang() === 'fr' ? 'en' : 'fr';
    this.setLang(next);
  }

  private isValid(value: string | null): value is Lang {
    return value === 'fr' || value === 'en';
  }
}
