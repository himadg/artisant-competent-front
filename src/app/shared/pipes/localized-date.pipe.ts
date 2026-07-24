import { Pipe, PipeTransform, inject } from '@angular/core';
import { LangService } from '../../core/services/lang.service';
import {
  DATE_STYLE_COMPACT,
  DATE_STYLE_FULL,
  DATE_STYLE_MONTH_YEAR,
  formatLocalizedDate,
  formatLocalizedTime,
} from '../../core/utils/date-format';

export type LocalizedDateStyle = 'full' | 'compact' | 'monthYear' | 'time' | 'dateTime';

/**
 * Remplace le pipe `date` d'Angular pour les dates affichées à l'utilisateur : réagit à la
 * langue active (LangService) et écrit toujours le mois en toutes lettres, jamais en numéro,
 * pour éviter toute ambiguïté jour/mois selon la locale (cf. `date-format.ts`).
 * `pure: false` : nécessaire pour se recalculer quand la langue change, indépendamment de la
 * valeur de date elle-même — coût négligeable (API Intl native, quelques dates par page).
 */
@Pipe({ name: 'localizedDate', standalone: true, pure: false })
export class LocalizedDatePipe implements PipeTransform {
  private readonly langService = inject(LangService);

  transform(value: string | Date | null | undefined, style: LocalizedDateStyle = 'full'): string {
    if (!value) return '';
    const lang = this.langService.lang();

    if (style === 'time') return formatLocalizedTime(value, lang);
    if (style === 'dateTime') {
      return `${formatLocalizedDate(value, lang, DATE_STYLE_COMPACT)} ${formatLocalizedTime(value, lang)}`;
    }

    const options = style === 'compact' ? DATE_STYLE_COMPACT : style === 'monthYear' ? DATE_STYLE_MONTH_YEAR : DATE_STYLE_FULL;
    return formatLocalizedDate(value, lang, options);
  }
}
