"use client";

import { Plus, Send } from "lucide-react";
import { useState } from "react";
import { channels, initialMessages } from "@/lib/data/messages";
import { useMessage } from "@/lib/hooks/use-message";

export default function MessagesPage() {
  const message = useMessage();
  const [activeChannel, setActiveChannel] = useState(channels[0].id);
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");

  const channel = channels.find((c) => c.id === activeChannel) ?? channels[0];

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: `local-${Date.now()}`, authorName: "John Anderson", authorInitials: "JA", text, time: "Just now" }]);
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
              onClick={() => message.info("Creating channels is not part of this demo.")}
            >
              <Plus size={15} />
            </button>
          </div>
          {channels.map((c) => (
            <div key={c.id} className={`channel-row ${activeChannel === c.id ? "active" : ""}`} onClick={() => setActiveChannel(c.id)}>
              <span># {c.name}</span>
              {c.unread > 0 ? <span className="tiny muted" style={{ marginLeft: "auto" }}>{c.unread}</span> : null}
            </div>
          ))}
        </div>
        <div className="card" style={{ gridColumn: "span 2", minHeight: 500, display: "flex", flexDirection: "column" }}>
          <div className="panel-head">
            <strong># {channel.name}</strong>
            <span className="tiny muted">{channel.memberCount} members</span>
          </div>
          <div className="panel-body" style={{ flex: 1, overflow: "auto" }}>
            {messages.map((m) => (
              <div key={m.id} className="activity">
                <span className="avatar">{m.authorInitials}</span>
                <div className="activity-text">
                  <strong>{m.authorName}</strong>
                  <div style={{ marginTop: 3 }}>{m.text}</div>
                  <div className="activity-time">{m.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: 12, borderTop: "1px solid var(--border)" }}>
            <div className="search" style={{ maxWidth: "none", margin: 0 }}>
              <input
                placeholder={`Message #${channel.name}...`}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
              />
              <button type="button" className="icon-btn" style={{ width: 28, height: 28 }} onClick={send} aria-label="Send message">
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
