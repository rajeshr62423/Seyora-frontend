import type { User } from "./user";

export interface ChatChannel {
  id: string;
  name: string;
  memberCount: number;
  unread: number;
  createdAt: string;
  members: User[];
}

export interface ChatMessage {
  id: string;
  channelId: string;
  authorId: string;
  author: User;
  text: string;
  createdAt: string; // full ISO timestamp — see lib/format.ts#formatRelativeTime
}
