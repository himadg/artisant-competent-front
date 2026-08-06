/** Photo seule (pas de PDF) : photo de profil, photo de demande, pièce jointe image. */
export const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

/** Image ou PDF : pièce d'identité, diplôme, logo, RIB, pièce jointe de messagerie. */
export const ALLOWED_DOCUMENT_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);

/** Champs de documents de l'inscription professionnelle. */
export type DocTarget = 'photo' | 'idFront' | 'idBack' | 'logo' | 'rib';

/** Seule la photo de profil n'accepte que des images ; les autres champs acceptent aussi un PDF. */
export const IMAGE_ONLY_TARGETS = new Set<DocTarget>(['photo']);
