import type { CheckoutSession, Plan, Subscription } from "@/types/billing";

export interface BillingState {
  plans: Plan[];
  plansLoading: boolean;
  plansError: string | null;

  subscription: Subscription | null;
  subscriptionLoading: boolean;
  subscriptionError: string | null;

  checkingOut: boolean;
  checkoutError: string | null;
  // Consumed by BillingTab to open the Razorpay widget, then cleared —
  // not meant to be rendered directly.
  checkoutSession: CheckoutSession | null;

  verifying: boolean;
  verifyError: string | null;

  canceling: boolean;
  cancelError: string | null;
}
