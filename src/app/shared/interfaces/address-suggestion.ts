export interface AddressSuggestion {
  label: string;
  streetNumber: string;
  streetName: string;
  postalCode: string;
  city: string;
  latitude: number;
  longitude: number;
}

/** Vue restreinte d'une AddressSuggestion une fois sélectionnée dans un formulaire de recherche
 * (search-pro-form) : seuls le label et les coordonnées pilotent la recherche elle-même, le reste
 * de l'adresse n'y est jamais utilisé. */
export interface SelectedAddress {
  label: string;
  latitude: number;
  longitude: number;
}
