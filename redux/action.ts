import type { AuthAction } from "./auth/action";
import type { UsersAction } from "./users/action";
import type { ProjectsAction } from "./projects/action";
import type { OrganizationAction } from "./organization/action";
import type { TasksAction } from "./tasks/action";
import type { ActivityAction } from "./activity/action";
import type { NotificationsAction } from "./notifications/action";
import type { AnalyticsAction } from "./analytics/action";
import type { MessagesAction } from "./messages/action";
import type { ApiKeysAction } from "./apiKeys/action";
import type { WebhooksAction } from "./webhooks/action";
import type { IntegrationsAction } from "./integrations/action";
import type { BillingAction } from "./billing/action";

export type AppAction =
  | AuthAction
  | UsersAction
  | ProjectsAction
  | OrganizationAction
  | TasksAction
  | ActivityAction
  | NotificationsAction
  | AnalyticsAction
  | MessagesAction
  | ApiKeysAction
  | WebhooksAction
  | IntegrationsAction
  | BillingAction;
