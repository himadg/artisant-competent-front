export type LangCode = 'fr' | 'en';

function resolveLocale(lang: LangCode): string {
  return lang === 'en' ? 'en-US' : 'fr-FR';
}

/**
 * Formate une date en toutes lettres (nom du mois, jamais son numéro) : un mois écrit ne peut
 * jamais être confondu avec un jour, contrairement à un format numérique (03/04 = 3 avril ou
 * 4 mars ?). L'ordre jour/mois s'adapte en plus naturellement à la langue active.
 */
export function formatLocalizedDate(value: string | Date, lang: LangCode, options: Intl.DateTimeFormatOptions): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleDateString(resolveLocale(lang), options);
}

export function formatLocalizedTime(value: string | Date, lang: LangCode): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleTimeString(resolveLocale(lang), { hour: '2-digit', minute: '2-digit' });
}

/** Contexte spacieux, valeur isolée (ex: date de naissance, en-tête de détail). */
export const DATE_STYLE_FULL: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
/** Contexte compact, liste/badge/méta. */
export const DATE_STYLE_COMPACT: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
/** Mois + année seuls (ex: "Membre depuis juillet 2026"). */
export const DATE_STYLE_MONTH_YEAR: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
/** Jour + mois sans année, pour un horodatage récent (ex: liste de conversations). */
export const DATE_STYLE_DAY_MONTH: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
