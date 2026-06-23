export const TIME_FR_REGEXP = /^([01]\d|2[0-3]):[0-5]\d$/;
export const SIRET_REGEXP = /^\d{14}$/;
export const PHONE_FR_REGEXP = /^(?:06\d{8}|07\d{8}|09\d{8}|0442\d{6})$/; // 10 chiffres commençant par 06, 07, 09 ou 0442
export const PASSWORD_STRONG_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{12,}$/; // au moins 12 caractères, avec une lettre, un chiffre et un caractère spécial
export const POSTAL_CODE_REGEXP = /^\d{5}$/;
export const NAME_REGEXP = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;
export const STREET_NUMBER_REGEXP = /^\d+\s?(bis|ter|quater|quinquies|[a-z]\d*)?$/i;
export const URL_REGEXP = /^https?:\/\/([\w-]+\.)+[\w-]{2,}(\/[\w\-./?%&=#]*)?$/i;
export const ADDRESS_REGEXP = /^[a-zA-ZÀ-ÿ0-9,-]+$/;
