import type { ChatChannel, ChatMessage } from "@/types/message";

export interface MessagesState {
  channels: ChatChannel[];
  channelsLoading: boolean;
  channelsError: string | null;

  creatingChannel: boolean;
  createChannelError: string | null;
  isCreateChannelModalOpen: boolean;

  updatingChannel: boolean;
  updateChannelError: string | null;
  editingChannelId: string | null;

  // Single-slot cache for whichever channel is currently open — mirrors
  // redux/tasks's projectTasks/projectTasksProjectId pattern. Only one
  // channel's thread is ever viewed at a time, so no need to cache every
  // channel's messages simultaneously.
  messages: ChatMessage[];
  messagesChannelId: string | null;
  messagesLoading: boolean;
  messagesError: string | null;

  sending: boolean;
  sendError: string | null;
}
