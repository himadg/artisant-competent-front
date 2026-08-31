/** Photo seule (pas de PDF) : photo de profil, photo de demande, pièce jointe image. */
export const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

/** Image ou PDF : pièce d'identité, diplôme, logo, RIB, pièce jointe de messagerie. */
export const ALLOWED_DOCUMENT_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);

/** Champs de documents de l'inscription professionnelle. */
export type DocTarget = 'photo' | 'idFront' | 'idBack' | 'logo' | 'rib';

/** Seule la photo de profil n'accepte que des images ; les autres champs acceptent aussi un PDF. */
export const IMAGE_ONLY_TARGETS = new Set<DocTarget>(['photo']);

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

/**
 * Un PNG animé (APNG) déclare le même type MIME "image/png" qu'un PNG classique côté navigateur —
 * seule l'inspection des chunks binaires (présence d'un chunk "acTL" avant "IDAT") permet de le
 * détecter, comme le fait déjà `file-type` côté back (qui le classe en "image/apng", type non autorisé).
 */
export async function isAnimatedPng(file: File): Promise<boolean> {
  if (file.type !== 'image/png') return false;

  const buffer = await file.slice(0, 8192).arrayBuffer(); // acTL précède toujours IDAT, largement dans les 8 premiers Ko
  const bytes = new Uint8Array(buffer);
  if (PNG_SIGNATURE.some((b, i) => bytes[i] !== b)) return false;

  const view = new DataView(buffer);
  let offset = 8;
  while (offset + 8 <= bytes.length) {
    const length = view.getUint32(offset);
    const type = String.fromCodePoint(bytes[offset + 4], bytes[offset + 5], bytes[offset + 6], bytes[offset + 7]);
    if (type === 'acTL') return true;
    if (type === 'IDAT') return false;
    offset += 8 + length + 4; // longueur + type + data + CRC
  }
  return false;
}

/** Valide un fichier contre les types autorisés, en détectant aussi le cas particulier des PNG animés. */
export async function isFileTypeAllowed(file: File, allowedTypes: Set<string>): Promise<boolean> {
  if (!allowedTypes.has(file.type)) return false;
  if (await isAnimatedPng(file)) return false;
  return true;
}
