import type { UnknownAction } from "redux";
import type { VerifyPaymentInput } from "@/lib/api/billing";
import type { CheckoutSession, Plan, Subscription } from "@/types/billing";
import {
  CANCEL_SUBSCRIPTION_FAILURE,
  CANCEL_SUBSCRIPTION_REQUEST,
  CANCEL_SUBSCRIPTION_SUCCESS,
  CLEAR_CHECKOUT_SESSION,
  CREATE_CHECKOUT_FAILURE,
  CREATE_CHECKOUT_REQUEST,
  CREATE_CHECKOUT_SUCCESS,
  FETCH_PLANS_FAILURE,
  FETCH_PLANS_REQUEST,
  FETCH_PLANS_SUCCESS,
  FETCH_SUBSCRIPTION_FAILURE,
  FETCH_SUBSCRIPTION_REQUEST,
  FETCH_SUBSCRIPTION_SUCCESS,
  VERIFY_PAYMENT_FAILURE,
  VERIFY_PAYMENT_REQUEST,
  VERIFY_PAYMENT_SUCCESS,
} from "./actionType";

export interface FetchPlansRequestAction extends UnknownAction {
  type: typeof FETCH_PLANS_REQUEST;
}
export interface FetchPlansSuccessAction extends UnknownAction {
  type: typeof FETCH_PLANS_SUCCESS;
  payload: Plan[];
}
export interface FetchPlansFailureAction extends UnknownAction {
  type: typeof FETCH_PLANS_FAILURE;
  payload: string;
}

export interface FetchSubscriptionRequestAction extends UnknownAction {
  type: typeof FETCH_SUBSCRIPTION_REQUEST;
}
export interface FetchSubscriptionSuccessAction extends UnknownAction {
  type: typeof FETCH_SUBSCRIPTION_SUCCESS;
  payload: Subscription;
}
export interface FetchSubscriptionFailureAction extends UnknownAction {
  type: typeof FETCH_SUBSCRIPTION_FAILURE;
  payload: string;
}

export interface CreateCheckoutRequestAction extends UnknownAction {
  type: typeof CREATE_CHECKOUT_REQUEST;
  payload: string;
}
export interface CreateCheckoutSuccessAction extends UnknownAction {
  type: typeof CREATE_CHECKOUT_SUCCESS;
  payload: CheckoutSession;
}
export interface CreateCheckoutFailureAction extends UnknownAction {
  type: typeof CREATE_CHECKOUT_FAILURE;
  payload: string;
}
export interface ClearCheckoutSessionAction extends UnknownAction {
  type: typeof CLEAR_CHECKOUT_SESSION;
}

export interface VerifyPaymentRequestAction extends UnknownAction {
  type: typeof VERIFY_PAYMENT_REQUEST;
  payload: VerifyPaymentInput;
}
export interface VerifyPaymentSuccessAction extends UnknownAction {
  type: typeof VERIFY_PAYMENT_SUCCESS;
}
export interface VerifyPaymentFailureAction extends UnknownAction {
  type: typeof VERIFY_PAYMENT_FAILURE;
  payload: string;
}

export interface CancelSubscriptionRequestAction extends UnknownAction {
  type: typeof CANCEL_SUBSCRIPTION_REQUEST;
}
export interface CancelSubscriptionSuccessAction extends UnknownAction {
  type: typeof CANCEL_SUBSCRIPTION_SUCCESS;
}
export interface CancelSubscriptionFailureAction extends UnknownAction {
  type: typeof CANCEL_SUBSCRIPTION_FAILURE;
  payload: string;
}

export type BillingAction =
  | FetchPlansRequestAction
  | FetchPlansSuccessAction
  | FetchPlansFailureAction
  | FetchSubscriptionRequestAction
  | FetchSubscriptionSuccessAction
  | FetchSubscriptionFailureAction
  | CreateCheckoutRequestAction
  | CreateCheckoutSuccessAction
  | CreateCheckoutFailureAction
  | ClearCheckoutSessionAction
  | VerifyPaymentRequestAction
  | VerifyPaymentSuccessAction
  | VerifyPaymentFailureAction
  | CancelSubscriptionRequestAction
  | CancelSubscriptionSuccessAction
  | CancelSubscriptionFailureAction;

export const fetchPlansRequest = (): FetchPlansRequestAction => ({ type: FETCH_PLANS_REQUEST });
export const fetchPlansSuccess = (payload: Plan[]): FetchPlansSuccessAction => ({
  type: FETCH_PLANS_SUCCESS,
  payload,
});
export const fetchPlansFailure = (payload: string): FetchPlansFailureAction => ({
  type: FETCH_PLANS_FAILURE,
  payload,
});

export const fetchSubscriptionRequest = (): FetchSubscriptionRequestAction => ({
  type: FETCH_SUBSCRIPTION_REQUEST,
});
export const fetchSubscriptionSuccess = (payload: Subscription): FetchSubscriptionSuccessAction => ({
  type: FETCH_SUBSCRIPTION_SUCCESS,
  payload,
});
export const fetchSubscriptionFailure = (payload: string): FetchSubscriptionFailureAction => ({
  type: FETCH_SUBSCRIPTION_FAILURE,
  payload,
});

export const createCheckoutRequest = (planKey: string): CreateCheckoutRequestAction => ({
  type: CREATE_CHECKOUT_REQUEST,
  payload: planKey,
});
export const createCheckoutSuccess = (payload: CheckoutSession): CreateCheckoutSuccessAction => ({
  type: CREATE_CHECKOUT_SUCCESS,
  payload,
});
export const createCheckoutFailure = (payload: string): CreateCheckoutFailureAction => ({
  type: CREATE_CHECKOUT_FAILURE,
  payload,
});
export const clearCheckoutSession = (): ClearCheckoutSessionAction => ({ type: CLEAR_CHECKOUT_SESSION });

export const verifyPaymentRequest = (payload: VerifyPaymentInput): VerifyPaymentRequestAction => ({
  type: VERIFY_PAYMENT_REQUEST,
  payload,
});
export const verifyPaymentSuccess = (): VerifyPaymentSuccessAction => ({ type: VERIFY_PAYMENT_SUCCESS });
export const verifyPaymentFailure = (payload: string): VerifyPaymentFailureAction => ({
  type: VERIFY_PAYMENT_FAILURE,
  payload,
});

export const cancelSubscriptionRequest = (): CancelSubscriptionRequestAction => ({
  type: CANCEL_SUBSCRIPTION_REQUEST,
});
export const cancelSubscriptionSuccess = (): CancelSubscriptionSuccessAction => ({
  type: CANCEL_SUBSCRIPTION_SUCCESS,
});
export const cancelSubscriptionFailure = (payload: string): CancelSubscriptionFailureAction => ({
  type: CANCEL_SUBSCRIPTION_FAILURE,
  payload,
});
