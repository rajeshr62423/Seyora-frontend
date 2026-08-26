export interface ChatChannel {
  id: string;
  name: string;
  memberCount: number;
  unread: number;
}

export interface ChatMessage {
  id: string;
  authorName: string;
  authorInitials: string;
  text: string;
  time: string;
}
