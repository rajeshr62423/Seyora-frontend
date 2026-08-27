import { combineReducers } from "redux";
import { authReducer } from "./auth/reducer";
import { usersReducer } from "./users/reducer";
import { projectsReducer } from "./projects/reducer";
import { organizationReducer } from "./organization/reducer";
import { tasksReducer } from "./tasks/reducer";
import { activityReducer } from "./activity/reducer";
import { notificationsReducer } from "./notifications/reducer";
import { analyticsReducer } from "./analytics/reducer";

export const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  projects: projectsReducer,
  organization: organizationReducer,
  tasks: tasksReducer,
  activity: activityReducer,
  notifications: notificationsReducer,
  analytics: analyticsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
