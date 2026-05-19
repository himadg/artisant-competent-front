/** Sujet de la demande envoyé via le formulaire de contact (clés stables, indépendantes de la langue). */
export type ContactSubject =
  | 'general'
  | 'service'
  | 'affiliate'
  | 'currentRequest'
  | 'technical'
  | 'press'
  | 'other';

/** Origine de l'envoi — sert à tracer côté backend d'où provient la demande. */
export type ContactSource = 'home' | 'footer';

/** Données soumises par le formulaire de contact (payload POST /api/contact). */
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: ContactSubject;
  message: string;
  consent: boolean;
  source: ContactSource;
}
