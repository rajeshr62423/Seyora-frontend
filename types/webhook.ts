export interface Webhook {
  id: string;
  url: string;
  events: string[];
  secret: string;
  lastDeliveryAt: string | null;
  createdAt: string;
}
