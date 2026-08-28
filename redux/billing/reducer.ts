import type { UnknownAction } from "redux";
import type { AppAction } from "../action";
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
import type { BillingState } from "./type";

const initialState: BillingState = {
  plans: [],
  plansLoading: false,
  plansError: null,

  subscription: null,
  subscriptionLoading: false,
  subscriptionError: null,

  checkingOut: false,
  checkoutError: null,
  checkoutSession: null,

  verifying: false,
  verifyError: null,

  canceling: false,
  cancelError: null,
};

export function billingReducer(state: BillingState = initialState, rawAction: UnknownAction): BillingState {
  const action = rawAction as AppAction;
  switch (action.type) {
    case FETCH_PLANS_REQUEST:
      return { ...state, plansLoading: true, plansError: null };
    case FETCH_PLANS_SUCCESS:
      return { ...state, plansLoading: false, plans: action.payload };
    case FETCH_PLANS_FAILURE:
      return { ...state, plansLoading: false, plansError: action.payload };

    case FETCH_SUBSCRIPTION_REQUEST:
      return { ...state, subscriptionLoading: true, subscriptionError: null };
    case FETCH_SUBSCRIPTION_SUCCESS:
      return { ...state, subscriptionLoading: false, subscription: action.payload };
    case FETCH_SUBSCRIPTION_FAILURE:
      return { ...state, subscriptionLoading: false, subscriptionError: action.payload };

    case CREATE_CHECKOUT_REQUEST:
      return { ...state, checkingOut: true, checkoutError: null };
    case CREATE_CHECKOUT_SUCCESS:
      return { ...state, checkingOut: false, checkoutSession: action.payload };
    case CREATE_CHECKOUT_FAILURE:
      return { ...state, checkingOut: false, checkoutError: action.payload };
    case CLEAR_CHECKOUT_SESSION:
      return { ...state, checkoutSession: null };

    case VERIFY_PAYMENT_REQUEST:
      return { ...state, verifying: true, verifyError: null };
    case VERIFY_PAYMENT_SUCCESS:
      return { ...state, verifying: false };
    case VERIFY_PAYMENT_FAILURE:
      return { ...state, verifying: false, verifyError: action.payload };

    case CANCEL_SUBSCRIPTION_REQUEST:
      return { ...state, canceling: true, cancelError: null };
    case CANCEL_SUBSCRIPTION_SUCCESS:
      return { ...state, canceling: false };
    case CANCEL_SUBSCRIPTION_FAILURE:
      return { ...state, canceling: false, cancelError: action.payload };

    default:
      return state;
  }
}
