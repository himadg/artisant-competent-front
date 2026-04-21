import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslocoLoader, translocoConfig as makeTranslocoConfig, TranslocoOptions } from '@jsverse/transloco';

class AppTranslocoLoader implements TranslocoLoader {
  private http = inject(HttpClient);

  getTranslation(lang: string) {
    return this.http.get<Record<string, unknown>>(`assets/i18n/${lang}.json`);
  }
}

export const translocoConfig: TranslocoOptions = {
  config: makeTranslocoConfig({
    availableLangs: ['en', 'fr'],
    defaultLang: 'fr',
    reRenderOnLangChange: true,
    prodMode: false,
  }),
  loader: AppTranslocoLoader,
};
