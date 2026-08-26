import type { AuthAction } from "./auth/action";
import type { UsersAction } from "./users/action";

export type AppAction = AuthAction | UsersAction;
