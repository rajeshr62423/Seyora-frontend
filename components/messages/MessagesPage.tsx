"use client";

import { Plus, Send, Settings } from "lucide-react";
import { useState } from "react";
import Avatar from "@/components/common/Avatar";
import { formatRelativeTime } from "@/lib/format";
import { useChannelMessages } from "@/lib/hooks/use-channel-messages";
import { openCreateChannelModal, openEditChannelModal, sendMessageRequest } from "@/redux/messages/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function MessagesPage() {
  const dispatch = useAppDispatch();
  const { channels, channelsLoading, sending } = useAppSelector((state) => state.messages);
  const [selectedChannelId, setSelectedChannelId] = useState<string | undefined>(undefined);
  const [draft, setDraft] = useState("");

  // Defaults to the first channel once the list loads, without a
  // setState-in-effect — just fall back during render until the user
  // explicitly picks something else.
  const activeChannelId = selectedChannelId ?? channels[0]?.id;

  const { messages, loading: messagesLoading } = useChannelMessages(activeChannelId);
  const channel = channels.find((c) => c.id === activeChannelId);

  const send = () => {
    const text = draft.trim();
    if (!text || !activeChannelId) return;
    dispatch(sendMessageRequest(activeChannelId, text));
    setDraft("");
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Messages</h1>
          <div className="page-sub">Team conversations related to your engineering work.</div>
        </div>
      </div>
      <div className="grid g3">
        <div className="card" style={{ minHeight: 500 }}>
          <div className="panel-head">
            <span className="card-title">Channels</span>
            <button
              type="button"
              className="icon-btn"
              style={{ width: 28, height: 28 }}
              onClick={() => dispatch(openCreateChannelModal())}
            >
              <Plus size={15} />
            </button>
          </div>
          {channelsLoading && channels.length === 0 ? (
            <div className="empty">
              <strong>Loading channels…</strong>
            </div>
          ) : channels.length === 0 ? (
            <div className="empty">
              <strong>No channels yet</strong>
              <div className="small muted" style={{ marginTop: 6 }}>
                Create one to start a conversation.
              </div>
            </div>
          ) : (
            channels.map((c) => (
              <div
                key={c.id}
                className={`channel-row ${activeChannelId === c.id ? "active" : ""}`}
                onClick={() => setSelectedChannelId(c.id)}
              >
                <span># {c.name}</span>
                {c.unread > 0 ? (
                  <span className="tiny muted" style={{ marginLeft: "auto" }}>
                    {c.unread}
                  </span>
                ) : null}
              </div>
            ))
          )}
        </div>
        <div className="card" style={{ gridColumn: "span 2", minHeight: 500, display: "flex", flexDirection: "column" }}>
          {channel ? (
            <>
              <div className="panel-head">
                <strong># {channel.name}</strong>
                <span className="tiny muted">{channel.memberCount} members</span>
                <button
                  type="button"
                  className="icon-btn"
                  style={{ width: 28, height: 28, marginLeft: "auto" }}
                  aria-label="Channel settings"
                  onClick={() => dispatch(openEditChannelModal(channel.id))}
                >
                  <Settings size={14} />
                </button>
              </div>
              <div className="panel-body" style={{ flex: 1, overflow: "auto" }}>
                {messagesLoading && messages.length === 0 ? (
                  <div className="empty">
                    <strong>Loading messages…</strong>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="empty">
                    <strong>No messages yet</strong>
                  </div>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} className="activity">
                      <Avatar url={m.author.avatarUrl} initials={m.author.initials} />
                      <div className="activity-text">
                        <strong>{m.author.name}</strong>
                        <div style={{ marginTop: 3 }}>{m.text}</div>
                        <div className="activity-time">{formatRelativeTime(m.createdAt)}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div style={{ padding: 12, borderTop: "1px solid var(--border)" }}>
                <div className="search" style={{ maxWidth: "none", margin: 0 }}>
                  <input
                    placeholder={`Message #${channel.name}...`}
                    value={draft}
                    disabled={sending}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") send();
                    }}
                  />
                  <button
                    type="button"
                    className="icon-btn"
                    style={{ width: 28, height: 28 }}
                    disabled={sending || !draft.trim()}
                    onClick={send}
                    aria-label="Send message"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="empty" style={{ margin: "auto" }}>
              <strong>Select a channel to start chatting</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
