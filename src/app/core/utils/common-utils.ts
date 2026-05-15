export enum UserType {
  INDIVIDUAL = 'individual',
  PROFESSIONAL = 'professional',
  SUPPLIER = 'supplier',
}

// --- SIRET ---
export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export const capitalize = (str: string): string => `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`;
