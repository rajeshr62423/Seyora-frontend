import type { ChatChannel, ChatMessage } from "@/types/message";
import { apiFetch } from "./client";
import { normalizeUser, type ApiUser } from "./users";

interface ApiChannel {
  id: number;
  name: string;
  createdAt: string;
  memberCount: number;
  unread: number;
  members: ApiUser[];
}

interface ApiMessage {
  id: number;
  channelId: number;
  authorId: number;
  author: ApiUser;
  text: string;
  createdAt: string;
}

export interface CreateChannelInput {
  name: string;
  memberIds?: number[];
}

export interface UpdateChannelInput {
  name?: string;
  memberIds?: number[];
}

function normalizeChannel(channel: ApiChannel): ChatChannel {
  return {
    id: String(channel.id),
    name: channel.name,
    memberCount: channel.memberCount,
    unread: channel.unread,
    createdAt: channel.createdAt,
    members: channel.members.map(normalizeUser),
  };
}

function normalizeMessage(message: ApiMessage): ChatMessage {
  return {
    id: String(message.id),
    channelId: String(message.channelId),
    authorId: String(message.authorId),
    author: normalizeUser(message.author),
    text: message.text,
    createdAt: message.createdAt,
  };
}

export async function listChannels(): Promise<ChatChannel[]> {
  const channels = await apiFetch<ApiChannel[]>("/channels", { method: "GET" });
  return channels.map(normalizeChannel);
}

export async function createChannel(input: CreateChannelInput): Promise<ChatChannel> {
  const channel = await apiFetch<ApiChannel>("/channels", { method: "POST", body: input });
  return normalizeChannel(channel);
}

export async function updateChannel(id: string, input: UpdateChannelInput): Promise<ChatChannel> {
  const channel = await apiFetch<ApiChannel>(`/channels/${id}`, { method: "PATCH", body: input });
  return normalizeChannel(channel);
}

export async function listMessages(channelId: string): Promise<ChatMessage[]> {
  const messages = await apiFetch<ApiMessage[]>(`/channels/${channelId}/messages`, { method: "GET" });
  return messages.map(normalizeMessage);
}

export async function sendMessage(channelId: string, text: string): Promise<ChatMessage> {
  const message = await apiFetch<ApiMessage>(`/channels/${channelId}/messages`, {
    method: "POST",
    body: { text },
  });
  return normalizeMessage(message);
}
