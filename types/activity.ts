import type { User } from "./user";

export interface ActivityEntry {
  id: string;
  organizationId: string;
  actorId: string;
  actor: User;
  action: string;
  targetType: string;
  targetId: string;
  target: string;
  createdAt: string; // full ISO timestamp — see lib/format.ts#formatRelativeTime
}
