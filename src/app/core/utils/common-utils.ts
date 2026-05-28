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

export function evaluatePasswordCriteria(pwd: string) {
  const safePwd = pwd || '';
  return {
    length: safePwd.length >= 12,
    lower: /[a-z]/.test(safePwd),
    upper: /[A-Z]/.test(safePwd),
    number: /[0-9]/.test(safePwd),
    special: /[^a-zA-Z0-9]/.test(safePwd),
  };
}

export function getAffiliateCode(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('affiliate_ref');
}

export function setAffiliateCode(code: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('affiliate_ref', code);
}

export function clearAffiliateCode(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('affiliate_ref');
}
