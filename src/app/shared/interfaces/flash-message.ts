export type FlashMessageType = 'success' | 'warning' | 'error' | 'info';

export interface FlashMessage {
  type: FlashMessageType;
  key: string;
}
