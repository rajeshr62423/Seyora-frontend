"use client";

import { Bell, Folder, LayoutGrid, ListChecks, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import CreateProjectModal from "@/components/projects/CreateProjectModal";
import TaskDetailModal from "@/components/tasks/TaskDetailModal";
import { useProjects } from "@/lib/context/projects-context";
import { SelectedTaskProvider, useSelectedTask } from "@/lib/context/selected-task-context";
import { fetchUsersRequest } from "@/redux/users/action";
import { loginRequest } from "@/redux/auth/action";
import { useAppDispatch } from "@/redux/hooks";
import CommandPalette from "./CommandPalette";
import Header from "./Header";
import Sidebar from "./Sidebar";

const SETTINGS_TAB_LABEL: Record<string, string> = {
  profile: "Profile",
  account: "Account",
  security: "Security",
  notifications: "Notification preferences",
  organization: "Organization",
  members: "Members & Roles",
  api: "API",
  webhooks: "Webhooks",
  billing: "Billing",
  "audit-logs": "Audit Logs",
  "danger-zone": "Danger Zone",
};

function getBreadcrumb(pathname: string, resolveProjectName: (slug: string) => string | undefined): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "projects") {
    if (!segments[1]) return "Projects";
    const name = resolveProjectName(segments[1]) ?? "Project";
    if (segments[2]) return `${name} / ${segments[2][0].toUpperCase()}${segments[2].slice(1)}`;
    return name;
  }
  if (segments[0] === "users") return segments[1] ? "Team Member" : "Team";
  if (segments[0] === "settings") return SETTINGS_TAB_LABEL[segments[1] ?? ""] ?? "Settings";
  if (segments[0] === "tasks") return "My Tasks";
  if (segments[0] === "calendar") return "Calendar";
  if (segments[0] === "analytics") return "Analytics";
  if (segments[0] === "activity") return "Activity";
  if (segments[0] === "notifications") return "Notifications";
  if (segments[0] === "messages") return "Messages";
  if (segments[0] === "integrations") return "Integrations";
  if (segments[0] === "github") return "GitHub";
  if (segments[0] === "search") return "Search";
  return "Dashboard";
}

const MOBILE_NAV = [
  { label: "Home", href: "/dashboard", icon: LayoutGrid },
  { label: "Projects", href: "/projects", icon: Folder },
  { label: "Tasks", href: "/tasks", icon: ListChecks },
  { label: "Alerts", href: "/notifications", icon: Bell },
  { label: "More", href: "/settings/profile", icon: Settings },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { projects } = useProjects();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUsersRequest());
    dispatch(loginRequest({ email: "john@acme.dev", password: "demo" }));
    // Bootstraps the auth + users slices exactly once when the shell mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Close the mobile drawer whenever the route changes. Adjusting state
  // during render (rather than in an effect) avoids an extra render pass.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileNavOpen(false);
  }

  // Lock page scroll behind the mobile drawer while it's open, and always
  // restore it — both on close and on unmount — so it can never get stuck.
  useEffect(() => {
    if (!mobileNavOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileNavOpen]);

  const breadcrumb = getBreadcrumb(pathname, (slug) => projects.find((p) => p.slug === slug)?.name);

  return (
    <SelectedTaskProvider>
      <div className="app">
        <Sidebar pathname={pathname} collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)} />

        <div className={`drawer ${mobileNavOpen ? "open" : ""}`} onClick={() => setMobileNavOpen(false)}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <Sidebar pathname={pathname} variant="drawer" />
          </div>
        </div>

        <main className="main">
          <Header
            breadcrumb={breadcrumb}
            onOpenMobileNav={() => setMobileNavOpen(true)}
            onOpenCommandPalette={() => setCommandOpen(true)}
          />
          {children}
        </main>

        <nav className="mobile-bottom">
          {MOBILE_NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} className={active ? "active" : ""} aria-current={active ? "page" : undefined}>
                <Icon size={18} strokeWidth={1.8} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <CreateProjectModal />
        <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
        <GlobalTaskModal />
      </div>
    </SelectedTaskProvider>
  );
}

function GlobalTaskModal() {
  const { selectedTask, closeTask } = useSelectedTask();
  return <TaskDetailModal task={selectedTask} onClose={closeTask} />;
}
