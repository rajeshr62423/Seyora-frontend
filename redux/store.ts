import { applyMiddleware, legacy_createStore as createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { rootReducer } from "./rootReducer";
import rootSaga from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

// This module is only ever imported by the client-side Providers component,
// so the store (and its saga) is created exactly once per browser session.
sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
