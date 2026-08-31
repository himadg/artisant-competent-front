import { TranslocoService } from '@jsverse/transloco';
import { FlashMessage } from '../../shared/interfaces/flash-message';

const KNOWN_FIELDS = new Set(['photo', 'idFront', 'idBack', 'logo', 'rib', 'diplomas']);

/** Construit le message à afficher après l'échec d'un envoi de documents (inscription pro ou
 * écran de reprise) : pointe le document précis en cause quand le back l'indique (`err.error.field`),
 * sinon retombe sur un message générique invitant à réessayer. */
export function buildDocumentUploadErrorMessage(err: unknown, transloco: TranslocoService): FlashMessage {
  const field = (err as { error?: { field?: string } })?.error?.field;

  if (field && KNOWN_FIELDS.has(field)) {
    return {
      type: 'error',
      key: 'errors.documentFieldFailed',
      params: { field: transloco.translate(`errors.documentFields.${field}`) },
    };
  }

  return { type: 'error', key: 'errors.documentsRetryFailed' };
}
