"use client";

import {
  Activity,
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Folder,
  LayoutGrid,
  ListChecks,
  MessageSquare,
  Plug,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import BrandLogo from "./BrandLogo";

interface NavItem {
  section?: string;
  label: string;
  href: string;
  icon: typeof Folder;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  {
    section: "Overview",
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutGrid,
  },
  { section: "Workspace", label: "Projects", href: "/projects", icon: Folder },
  { label: "My Tasks", href: "/tasks", icon: ListChecks },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Team", href: "/users", icon: Users },
  {
    section: "Insights",
    label: "Analytics",
    href: "/analytics",
    icon: TrendingUp,
  },
  { label: "Activity", href: "/activity", icon: Activity },
  {
    section: "Collaboration",
    label: "Notifications",
    href: "/notifications",
    icon: Bell,
    badge: 3,
  },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Integrations", href: "/integrations", icon: Plug },
  { label: "Settings", href: "/settings/profile", icon: Settings },
];

interface SidebarProps {
  pathname: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  variant?: "desktop" | "drawer";
}

export default function Sidebar({
  pathname,
  collapsed = false,
  onToggleCollapse,
  variant = "desktop",
}: SidebarProps) {
  const authUser = useAppSelector((state) => state.auth.user);
  const isDrawer = variant === "drawer";
  const isCollapsed = collapsed && !isDrawer;

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="brand">
        <div className="brand-left">
          <BrandLogo />
          <span className="brand-text">Seyora</span>
        </div>
        {!isDrawer && onToggleCollapse ? (
          <button
            type="button"
            className="icon-btn collapse-btn"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        ) : null}
      </div>

      <div className="org-switch">
        <span className="org-dot">A</span>
        <span className="org-name org-text">Chola Technology</span>
        <span className="chev">
          <ChevronsUpDown size={14} />
        </span>
      </div>

      <nav className="nav">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <div key={item.href}>
              {item.section ? (
                <div className="nav-section">{item.section}</div>
              ) : null}
              <Link
                href={item.href}
                className={`nav-item ${active ? "active" : ""}`}
                title={item.label}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span className="nav-label">{item.label}</span>
                {item.badge ? (
                  <span className="count">{item.badge}</span>
                ) : null}
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <Link href="/settings/profile" className="user">
          <span className="avatar">{authUser?.initials ?? "JA"}</span>
          <div className="user-info">
            <div className="user-name">{authUser?.name ?? "John Anderson"}</div>
            <div className="user-role">
              {authUser?.role ?? "Senior Developer"}
            </div>
          </div>
        </Link>
      </div>
    </aside>
  );
}
