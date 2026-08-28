import type { CheckoutSession, Plan, Subscription } from "@/types/billing";
import { apiFetch } from "./client";

interface ApiSubscription {
  id: number;
  organizationId: number;
  planKey: string;
  currentPeriodEnd: string | null;
  createdAt: string;
  updatedAt: string;
  plan: Plan;
  usage: { members: number; projects: number };
}

// POST /billing/verify and /billing/cancel return the bare updated
// Subscription row (no joined plan/usage — those are computed only by
// GET /billing/subscription) — callers refetch afterward for the
// enriched shape rather than treating this as a full Subscription.
interface ApiSubscriptionRaw {
  id: number;
  organizationId: number;
  planKey: string;
  currentPeriodEnd: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VerifyPaymentInput {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

function normalizeSubscription(sub: ApiSubscription): Subscription {
  return {
    id: String(sub.id),
    organizationId: String(sub.organizationId),
    planKey: sub.planKey,
    currentPeriodEnd: sub.currentPeriodEnd,
    createdAt: sub.createdAt,
    updatedAt: sub.updatedAt,
    plan: sub.plan,
    usage: sub.usage,
  };
}

export async function getPlans(): Promise<Plan[]> {
  return apiFetch<Plan[]>("/billing/plans", { method: "GET" });
}

export async function getSubscription(): Promise<Subscription> {
  const sub = await apiFetch<ApiSubscription>("/billing/subscription", { method: "GET" });
  return normalizeSubscription(sub);
}

export async function createCheckout(planKey: string): Promise<CheckoutSession> {
  return apiFetch<CheckoutSession>("/billing/checkout", { method: "POST", body: { planKey } });
}

export async function verifyPayment(input: VerifyPaymentInput): Promise<void> {
  await apiFetch<ApiSubscriptionRaw>("/billing/verify", { method: "POST", body: input });
}

export async function cancelSubscription(): Promise<void> {
  await apiFetch<ApiSubscriptionRaw>("/billing/cancel", { method: "POST" });
}
