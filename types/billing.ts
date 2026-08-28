export interface Plan {
  key: string;
  name: string;
  priceInPaise: number;
  interval: "month";
  features: string[];
}

export interface Subscription {
  id: string;
  organizationId: string;
  planKey: string;
  currentPeriodEnd: string | null;
  createdAt: string;
  updatedAt: string;
  plan: Plan;
  usage: { members: number; projects: number };
}

export interface CheckoutSession {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  planKey: string;
}
