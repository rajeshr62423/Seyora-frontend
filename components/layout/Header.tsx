"use client";

import { Popover } from "antd";
import {
  Bell,
  HelpCircle,
  Menu,
  Moon,
  Plus,
  Search,
  Settings,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { useState, type KeyboardEvent } from "react";
import Avatar from "@/components/common/Avatar";
import { formatRelativeTime } from "@/lib/format";
import { useTheme } from "@/lib/context/theme-context";
import { useAppRouter } from "@/lib/hooks/use-app-router";
import { useMessage } from "@/lib/hooks/use-message";
import { markReadRequest } from "@/redux/notifications/action";
import { openCreateProjectModal } from "@/redux/projects/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { NotificationEntry } from "@/types/notification";

interface HeaderProps {
  breadcrumb: string;
  onOpenMobileNav: () => void;
  onOpenCommandPalette: () => void;
}

export default function Header({
  breadcrumb,
  onOpenMobileNav,
  onOpenCommandPalette,
}: HeaderProps) {
  const router = useAppRouter();
  const dispatch = useAppDispatch();
  const { theme, toggleTheme } = useTheme();
  const authUser = useAppSelector((state) => state.auth.user);
  const notifications = useAppSelector((state) => state.notifications.list);
  const [query, setQuery] = useState("");
  const message = useMessage();

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && query.trim()) {
      router.push(`/projects?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Only "task" links exist today (task-assignment notifications), but
  // stays generic so a future targetType just needs a case added here.
  const openNotification = (n: NotificationEntry) => {
    if (n.unread) dispatch(markReadRequest(n.id));
    if (n.targetType === "task" && n.targetRef) {
      router.push(`/tasks/${n.targetRef}`);
    }
  };

  const notificationPopover = (
    <div style={{ width: 300 }}>
      {notifications.slice(0, 4).map((n) => {
        const hasLink = n.targetType === "task" && !!n.targetRef;
        return (
          <div
            key={n.id}
            className="activity"
            style={hasLink ? { cursor: "pointer" } : undefined}
            onClick={hasLink ? () => openNotification(n) : undefined}
          >
            {n.actor ? (
              <Avatar url={n.actor.avatarUrl} initials={n.actor.initials} />
            ) : (
              <span className="avatar">
                <Bell size={12} />
              </span>
            )}
            <div className="activity-text">
              <strong>{n.actor?.name ?? "System"}</strong> {n.verb} {n.target}
              <div className="activity-time">
                {formatRelativeTime(n.createdAt)}{" "}
                {n.unread ? (
                  <span style={{ color: "#A7F3D0" }}>· unread</span>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
      <Link
        href="/notifications"
        className="link small"
        style={{ display: "block", marginTop: 8, textAlign: "center" }}
      >
        View all notifications
      </Link>
    </div>
  );

  return (
    <header className="topbar">
      <button
        type="button"
        className="hamb"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>
      <div className="breadcrumb">
        Seyora <span>/</span> <strong>{breadcrumb}</strong>
      </div>
      <div className="search" onClick={onOpenCommandPalette}>
        <Search size={16} strokeWidth={1.8} />
        <input
          placeholder="Search anything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          onClick={(e) => e.stopPropagation()}
          aria-label="Search"
        />
        <span className="kbd">Ctrl K</span>
      </div>
      <button type="button" className="btn primary" onClick={() => dispatch(openCreateProjectModal())}>
        <Plus size={16} />
        <span>New</span>
      </button>
      <Popover
        content={notificationPopover}
        title="Notifications"
        trigger="click"
        placement="bottomRight"
      >
        <button type="button" className="icon-btn" aria-label="Notifications">
          <Bell size={17} strokeWidth={1.8} />
          {unreadCount > 0 ? <span className="dot" /> : null}
        </button>
      </Popover>
      <button
        type="button"
        className="icon-btn help"
        aria-label="Help"
        onClick={() =>
          message.info("Keyboard shortcut: Ctrl/Cmd K to search anywhere.")
        }
      >
        <HelpCircle size={17} strokeWidth={1.8} />
      </button>
      <button
        type="button"
        className="icon-btn"
        aria-label={
          theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
        }
        onClick={toggleTheme}
      >
        {theme === "dark" ? (
          <Sun size={17} strokeWidth={1.8} />
        ) : (
          <Moon size={17} strokeWidth={1.8} />
        )}
      </button>
      <Link href="/settings/profile" className="icon-btn" aria-label="Settings">
        <Settings size={17} strokeWidth={1.8} />
      </Link>
      <Avatar url={authUser?.avatarUrl} initials={authUser?.initials ?? "JA"} title={authUser?.name ?? "John Anderson"} />
    </header>
  );
}
