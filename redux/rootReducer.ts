import { combineReducers } from "redux";
import { authReducer } from "./auth/reducer";
import { usersReducer } from "./users/reducer";

export const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
