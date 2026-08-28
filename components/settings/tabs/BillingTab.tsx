"use client";

import { Check } from "lucide-react";
import { useEffect, useRef } from "react";
import { useConfirm } from "@/lib/hooks/use-confirm";
import { useMessage } from "@/lib/hooks/use-message";
import { formatDisplayDateFull } from "@/lib/format";
import { openRazorpayCheckout } from "@/lib/razorpay";
import {
  cancelSubscriptionRequest,
  clearCheckoutSession,
  createCheckoutRequest,
  fetchPlansRequest,
  fetchSubscriptionRequest,
  verifyPaymentRequest,
} from "@/redux/billing/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const ADMIN_ROLES = ["OWNER", "ADMIN"];

function formatPrice(priceInPaise: number): string {
  if (priceInPaise === 0) return "Free";
  return `₹${(priceInPaise / 100).toLocaleString("en-IN")}/mo`;
}

export default function BillingTab() {
  const dispatch = useAppDispatch();
  const message = useMessage();
  const confirm = useConfirm();
  const {
    plans,
    plansLoading,
    subscription,
    subscriptionLoading,
    checkingOut,
    checkoutError,
    checkoutSession,
    verifying,
    verifyError,
    canceling,
    cancelError,
  } = useAppSelector((state) => state.billing);
  const authUser = useAppSelector((state) => state.auth.user);
  const members = useAppSelector((state) => state.organization.members);
  const openingCheckout = useRef(false);

  const myRole = members.find((m) => m.userId === authUser?.id)?.role;
  const isAdmin = myRole ? ADMIN_ROLES.includes(myRole) : false;

  useEffect(() => {
    dispatch(fetchPlansRequest());
    dispatch(fetchSubscriptionRequest());
  }, [dispatch]);

  useEffect(() => {
    if (checkoutError) message.error(checkoutError);
  }, [checkoutError, message]);
  useEffect(() => {
    if (verifyError) message.error(verifyError);
  }, [verifyError, message]);
  useEffect(() => {
    if (cancelError) message.error(cancelError);
  }, [cancelError, message]);

  // Opens the Razorpay widget the moment a checkout session appears, then
  // immediately clears it — the session is a one-shot instruction to open
  // the widget, not something to keep rendering from.
  useEffect(() => {
    if (!checkoutSession || openingCheckout.current) return;
    openingCheckout.current = true;
    const session = checkoutSession;
    dispatch(clearCheckoutSession());

    // `openRazorpayCheckout` resolves as soon as the widget is *opened*
    // (`.open()` is synchronous), not when it closes — so the "is a widget
    // currently open" guard can only be cleared by the widget's own close
    // paths (dismiss or a successful payment), not by this call resolving.
    openRazorpayCheckout({
      key: session.keyId,
      amount: session.amount,
      currency: session.currency,
      order_id: session.orderId,
      name: "Seyora",
      description: `Upgrade to ${session.planKey}`,
      handler: (response) => {
        openingCheckout.current = false;
        dispatch(
          verifyPaymentRequest({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          }),
        );
      },
      modal: {
        ondismiss: () => {
          openingCheckout.current = false;
        },
      },
      theme: { color: "#10B981" },
    }).catch((error: unknown) => {
      message.error(error instanceof Error ? error.message : "Unable to open checkout");
      openingCheckout.current = false;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutSession]);

  const handleUpgrade = (planKey: string) => {
    dispatch(createCheckoutRequest(planKey));
  };

  const handleDowngradeToFree = () => {
    confirm({
      title: "Downgrade to Free?",
      content: "Your paid plan will be canceled immediately and you'll lose access to paid features.",
      okText: "Downgrade",
      onConfirm: () => dispatch(cancelSubscriptionRequest()),
    });
  };

  const loading = plansLoading || subscriptionLoading;

  return (
    <div className="settings-content-card">
      <h2>Billing</h2>
      <p className="settings-desc">Manage your subscription and payment details.</p>

      {loading && !subscription ? (
        <div className="empty">
          <strong>Loading…</strong>
        </div>
      ) : subscription ? (
        <>
          <div className="card card-pad" style={{ background: "var(--card2)", marginBottom: 14 }}>
            <div className="tiny muted">Current plan</div>
            <div style={{ fontSize: 22, fontWeight: 760, margin: "5px 0" }}>{subscription.plan.name}</div>
            <div className="small muted">
              {formatPrice(subscription.plan.priceInPaise)} · billed monthly
              {subscription.currentPeriodEnd
                ? ` · renews ${formatDisplayDateFull(subscription.currentPeriodEnd.slice(0, 10))}`
                : ""}
            </div>
            {!isAdmin ? (
              <p className="tiny muted" style={{ marginTop: 10 }}>
                Only owners and admins can change the plan.
              </p>
            ) : null}
          </div>

          <div className="grid g3" style={{ marginBottom: 20 }}>
            <div>
              <div className="tiny muted">Team members</div>
              <strong>{subscription.usage.members}</strong>
            </div>
            <div>
              <div className="tiny muted">Projects</div>
              <strong>{subscription.usage.projects}</strong>
            </div>
          </div>

          <div className="grid g3">
            {plans.map((plan) => {
              const isCurrent = plan.key === subscription.planKey;
              return (
                <div key={plan.key} className="card card-pad" style={isCurrent ? { borderColor: "var(--success)" } : undefined}>
                  <strong>{plan.name}</strong>
                  <div style={{ fontSize: 18, fontWeight: 700, margin: "6px 0" }}>{formatPrice(plan.priceInPaise)}</div>
                  <div style={{ display: "grid", gap: 6, marginBottom: 12 }}>
                    {plan.features.map((f) => (
                      <div key={f} className="tiny muted" style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <Check size={12} /> {f}
                      </div>
                    ))}
                  </div>
                  {isCurrent ? (
                    <span className="badge badge-done">Current plan</span>
                  ) : isAdmin ? (
                    plan.priceInPaise > 0 ? (
                      <button
                        type="button"
                        className="btn primary"
                        style={{ width: "100%", justifyContent: "center" }}
                        disabled={checkingOut || verifying}
                        onClick={() => handleUpgrade(plan.key)}
                      >
                        {checkingOut || verifying ? "Processing…" : `Upgrade to ${plan.name}`}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn"
                        style={{ width: "100%", justifyContent: "center" }}
                        disabled={canceling}
                        onClick={handleDowngradeToFree}
                      >
                        {canceling ? "Downgrading…" : "Downgrade to Free"}
                      </button>
                    )
                  ) : null}
                </div>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}
