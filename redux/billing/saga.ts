import { call, put, takeLatest } from "redux-saga/effects";
import {
  cancelSubscription as cancelSubscriptionApi,
  createCheckout,
  getPlans,
  getSubscription,
  verifyPayment as verifyPaymentApi,
} from "@/lib/api/billing";
import type { CheckoutSession, Plan, Subscription } from "@/types/billing";
import {
  cancelSubscriptionFailure,
  cancelSubscriptionSuccess,
  createCheckoutFailure,
  createCheckoutSuccess,
  fetchPlansFailure,
  fetchPlansSuccess,
  fetchSubscriptionFailure,
  fetchSubscriptionRequest,
  fetchSubscriptionSuccess,
  verifyPaymentFailure,
  verifyPaymentSuccess,
  type CreateCheckoutRequestAction,
  type VerifyPaymentRequestAction,
} from "./action";
import {
  CANCEL_SUBSCRIPTION_REQUEST,
  CREATE_CHECKOUT_REQUEST,
  FETCH_PLANS_REQUEST,
  FETCH_SUBSCRIPTION_REQUEST,
  VERIFY_PAYMENT_REQUEST,
} from "./actionType";

function* handleFetchPlans() {
  try {
    const plans: Plan[] = yield call(getPlans);
    yield put(fetchPlansSuccess(plans));
  } catch (error) {
    yield put(fetchPlansFailure(error instanceof Error ? error.message : "Unable to load plans"));
  }
}

function* handleFetchSubscription() {
  try {
    const subscription: Subscription = yield call(getSubscription);
    yield put(fetchSubscriptionSuccess(subscription));
  } catch (error) {
    yield put(fetchSubscriptionFailure(error instanceof Error ? error.message : "Unable to load subscription"));
  }
}

function* handleCreateCheckout(action: CreateCheckoutRequestAction) {
  try {
    const session: CheckoutSession = yield call(createCheckout, action.payload);
    yield put(createCheckoutSuccess(session));
  } catch (error) {
    yield put(createCheckoutFailure(error instanceof Error ? error.message : "Unable to start checkout"));
  }
}

function* handleVerifyPayment(action: VerifyPaymentRequestAction) {
  try {
    yield call(verifyPaymentApi, action.payload);
    yield put(verifyPaymentSuccess());
    // /billing/verify returns only the bare subscription row (no plan/
    // usage) — refetch the enriched shape for the UI.
    yield put(fetchSubscriptionRequest());
  } catch (error) {
    yield put(verifyPaymentFailure(error instanceof Error ? error.message : "Payment verification failed"));
  }
}

function* handleCancelSubscription() {
  try {
    yield call(cancelSubscriptionApi);
    yield put(cancelSubscriptionSuccess());
    yield put(fetchSubscriptionRequest());
  } catch (error) {
    yield put(cancelSubscriptionFailure(error instanceof Error ? error.message : "Unable to cancel subscription"));
  }
}

export function* billingSaga() {
  yield takeLatest(FETCH_PLANS_REQUEST, handleFetchPlans);
  yield takeLatest(FETCH_SUBSCRIPTION_REQUEST, handleFetchSubscription);
  yield takeLatest(CREATE_CHECKOUT_REQUEST, handleCreateCheckout);
  yield takeLatest(VERIFY_PAYMENT_REQUEST, handleVerifyPayment);
  yield takeLatest(CANCEL_SUBSCRIPTION_REQUEST, handleCancelSubscription);
}
