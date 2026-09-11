import { FlashMessage } from '../../shared/interfaces/flash-message';

const CODE_TO_KEY: Record<string, string> = {
  STORY_MAX_REACHED: 'dashboard.pro.storyMaxReachedError',
  STORY_DURATION_EXCEEDED: 'dashboard.pro.storyDurationExceededError',
  STORY_FORMAT_UNSUPPORTED: 'dashboard.pro.storyFormatUnsupportedError',
  STORY_NO_FILE: 'dashboard.pro.storyNoFileError',
};

/** Construit le message à afficher après l'échec d'un envoi de story : pointe la cause précise
 * quand le back l'indique (`err.error.code`), sinon retombe sur un message générique. */
export function buildStoryUploadErrorMessage(err: unknown): FlashMessage {
  const code = (err as { error?: { code?: string } })?.error?.code;
  const key = (code && CODE_TO_KEY[code]) || 'dashboard.pro.storyGenericUploadError';
  return { type: 'error', key };
}
