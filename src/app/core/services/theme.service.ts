import { Injectable, signal } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'theme';
  private readonly isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
  private readonly mediaQuery = this.isBrowser ? window.matchMedia('(prefers-color-scheme: dark)') : undefined;

  // Current user-selected theme: 'light' | 'dark'
  readonly theme = signal<Theme>('light');

  constructor() {
    const saved = this.isBrowser ? (localStorage.getItem(this.storageKey) as Theme | null) : null;
    this.theme.set(saved && this.isValidTheme(saved) ? saved : 'light');
    this.applyTheme();
  }

  setTheme(theme: Theme) {
    if (!this.isValidTheme(theme)) return;
    this.theme.set(theme);
    if (this.isBrowser) localStorage.setItem(this.storageKey, theme);
    this.applyTheme();
  }

  toggle() {
    const next: Theme = this.effectiveDark() ? 'light' : 'dark';
    this.setTheme(next);
  }

  effectiveDark(): boolean {
    if (!this.isBrowser) return false;
    if (this.theme() === 'dark') return true;
    if (this.theme() === 'light') return false;
    return !!this.mediaQuery?.matches;
  }

  private applyTheme() {
    if (!this.isBrowser) return;
    const dark = this.effectiveDark();
    const root = document.documentElement;
    root.classList.toggle('dark', dark);
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
  }

  private isValidTheme(value: string | null): value is Theme {
    return value === 'light' || value === 'dark';
  }
}
