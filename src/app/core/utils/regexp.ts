export const TIME_FR_REGEXP = /^([01]\d|2[0-3]):[0-5]\d$/;
export const SIRET_REGEXP = /^\d{14}$/;
export const PHONE_FR_REGEXP = /^(?:06\d{8}|07\d{8}|09\d{8}|0442\d{6})$/; // 10 chiffres commençant par 06, 07, 09 ou 0442
export const PASSWORD_STRONG_REGEXP = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/; // au moins 8 caractères, avec une lettre, un chiffre et un caractère spécial
export const POSTAL_CODE_REGEXP = /^\d{5}$/;
export const NAME_REGEXP = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;
export const STREET_NUMBER_REGEXP = /^\d+$/;
