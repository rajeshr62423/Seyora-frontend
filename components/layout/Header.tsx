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
import { notifications } from "@/lib/data/notifications";
import { useProjects } from "@/lib/context/projects-context";
import { useTheme } from "@/lib/context/theme-context";
import { useAppRouter } from "@/lib/hooks/use-app-router";
import { useMessage } from "@/lib/hooks/use-message";
import { useAppSelector } from "@/redux/hooks";

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
  const { openCreateModal } = useProjects();
  const { theme, toggleTheme } = useTheme();
  const authUser = useAppSelector((state) => state.auth.user);
  const [query, setQuery] = useState("");
  const message = useMessage();

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && query.trim()) {
      router.push(`/projects?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const notificationPopover = (
    <div style={{ width: 300 }}>
      {notifications.slice(0, 4).map((n) => (
        <div key={n.id} className="activity">
          <span className="avatar">{n.actorInitials}</span>
          <div className="activity-text">
            <strong>{n.actorName}</strong> {n.verb} {n.target}
            <div className="activity-time">
              {n.time}{" "}
              {n.unread ? (
                <span style={{ color: "#A7F3D0" }}>· unread</span>
              ) : null}
            </div>
          </div>
        </div>
      ))}
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
      <button type="button" className="btn primary" onClick={openCreateModal}>
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
      <span className="avatar" title={authUser?.name ?? "John Anderson"}>
        {authUser?.initials ?? "JA"}
      </span>
    </header>
  );
}
