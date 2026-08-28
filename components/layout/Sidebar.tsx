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
import Avatar from "@/components/common/Avatar";
import { ORG_ROLE_LABEL } from "@/lib/status";
import BrandLogo from "./BrandLogo";

interface NavItem {
  section?: string;
  label: string;
  href: string;
  icon: typeof Folder;
  // UI-visibility only — hides the item when the caller's role doesn't
  // grant this permission. The backend enforces the real check on every
  // route the item links to regardless of whether it's shown here.
  permission?: string;
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
  },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Integrations", href: "/integrations", icon: Plug },
  { label: "Settings", href: "/settings/profile", icon: Settings, permission: "SETTINGS_VIEW" },
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
  const organization = useAppSelector((state) => state.organization.current);
  const myRole = useAppSelector((state) => state.organization.myRole);
  const myPermissions = useAppSelector((state) => state.organization.myPermissions);
  const unreadCount = useAppSelector(
    (state) => state.notifications.list.filter((n) => n.unread).length,
  );
  const isDrawer = variant === "drawer";
  const isCollapsed = collapsed && !isDrawer;
  const visibleNavItems = NAV_ITEMS.filter(
    (item) => !item.permission || myPermissions.includes(item.permission),
  );

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
        <Avatar
          url={organization?.logoUrl}
          initials={organization?.name?.[0]?.toUpperCase() ?? "S"}
          className="org-dot"
        />
        <span className="org-name org-text">{organization?.name ?? "Seyora"}</span>
        <span className="chev">
          <ChevronsUpDown size={14} />
        </span>
      </div>

      <nav className="nav">
        {visibleNavItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          const badge = item.href === "/notifications" ? unreadCount : 0;
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
                {badge > 0 ? <span className="count">{badge}</span> : null}
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <Link href="/settings/profile" className="user">
          <Avatar url={authUser?.avatarUrl} initials={authUser?.initials ?? "JA"} />
          <div className="user-info">
            <div className="user-name">{authUser?.name ?? "John Anderson"}</div>
            <div className="user-role">
              {myRole ? ORG_ROLE_LABEL[myRole] : "Senior Developer"}
            </div>
          </div>
        </Link>
      </div>
    </aside>
  );
}
