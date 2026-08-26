"use client";

import { Activity, Bell, Check, GitBranch, MessageSquare, Settings } from "lucide-react";
import { useMemo, useState } from "react";
import { useMessage } from "@/lib/hooks/use-message";
import { notifications as initialNotifications } from "@/lib/data/notifications";
import type { NotificationCategory } from "@/types/notification";

const TABS: { label: string; value: NotificationCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Mentions", value: "mention" },
  { label: "Assignments", value: "assign" },
  { label: "Comments", value: "comment" },
  { label: "Task updates", value: "update" },
  { label: "System", value: "system" },
];

const ICON_FOR: Record<NotificationCategory, typeof Bell> = {
  mention: MessageSquare,
  assign: Bell,
  comment: MessageSquare,
  update: GitBranch,
  system: Activity,
};

export default function NotificationsPage() {
  const message = useMessage();
  const [items, setItems] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState<NotificationCategory | "all">("all");

  const filtered = useMemo(
    () => (activeTab === "all" ? items : items.filter((n) => n.category === activeTab)),
    [items, activeTab]
  );

  const unreadCount = items.filter((n) => n.unread).length;
  const attentionCount = items.filter((n) => n.category === "assign" || n.category === "mention").length;

  const markRead = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">Inbox / Activity</div>
          <h1 className="page-title">Notifications</h1>
          <div className="page-sub">Everything that needs your attention, from assignments to engineering activity.</div>
        </div>
        <div className="actions">
          <button type="button" className="btn" onClick={() => message.info("Preferences are not part of this demo.")}>
            <Settings size={15} /> Preferences
          </button>
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
              message.success("All notifications marked as read");
            }}
          >
            Mark all read
          </button>
        </div>
      </div>

      <div className="notification-layout">
        <div className="card notification-card">
          <div className="notification-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                className={`tab ${activeTab === tab.value ? "active" : ""}`}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
                <span className="tiny muted" style={{ marginLeft: 4 }}>
                  {tab.value === "all" ? items.length : items.filter((n) => n.category === tab.value).length}
                </span>
              </button>
            ))}
          </div>
          <div>
            {filtered.length === 0 ? (
              <div className="empty">
                <strong>No notifications in this category</strong>
              </div>
            ) : (
              filtered.map((n) => {
                const Icon = ICON_FOR[n.category];
                return (
                  <div key={n.id} className={`notification-row ${n.unread ? "unread" : ""}`}>
                    <div className="notification-avatar">
                      <Icon size={16} />
                    </div>
                    <div className="notification-copy">
                      <div className="notification-title">
                        <strong>{n.actorName}</strong> {n.verb} <strong>{n.target}</strong>
                      </div>
                      <div className="notification-time">
                        {n.time} · {n.unread ? "Unread" : "Read"}
                      </div>
                    </div>
                    {n.unread ? <span className="badge badge-progressing">New</span> : <span className="badge badge-gray">Read</span>}
                    <div className="notification-actions">
                      <button type="button" className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => markRead(n.id)}>
                        <Check size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <aside className="card notification-side">
          <h3>Inbox overview</h3>
          <div className="notif-stat">
            <div className="notif-stat-icon">
              <Bell size={15} />
            </div>
            <div>
              <b>{items.length}</b>
              <span>Total notifications</span>
            </div>
          </div>
          <div className="notif-stat">
            <div className="notif-stat-icon">
              <Activity size={15} />
            </div>
            <div>
              <b>{attentionCount}</b>
              <span>Need your attention</span>
            </div>
          </div>
          <div className="notif-stat">
            <div className="notif-stat-icon">
              <Check size={15} />
            </div>
            <div>
              <b>{items.length - unreadCount}</b>
              <span>Read this week</span>
            </div>
          </div>
          <div style={{ marginTop: 18, padding: 12, border: "1px solid rgba(16,185,129,.18)", background: "rgba(16,185,129,.05)", borderRadius: 10 }}>
            <div className="tiny muted">Tip</div>
            <div className="small" style={{ marginTop: 5, lineHeight: 1.5 }}>
              Use notification preferences to control email and workspace alerts.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
