"use client";

import { Bell, Folder, LayoutGrid, ListChecks, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import CreateProjectModal from "@/components/projects/CreateProjectModal";
import CreateTaskModal from "@/components/tasks/CreateTaskModal";
import TaskDetailModal from "@/components/tasks/TaskDetailModal";
import { useAppRouter } from "@/lib/hooks/use-app-router";
import { fetchUsersRequest } from "@/redux/users/action";
import { fetchProjectsRequest } from "@/redux/projects/action";
import { fetchMembersRequest, fetchOrganizationRequest } from "@/redux/organization/action";
import { closeTask, fetchMyTasksRequest } from "@/redux/tasks/action";
import { fetchActivityRequest } from "@/redux/activity/action";
import { fetchNotificationsRequest } from "@/redux/notifications/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
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
  const router = useAppRouter();
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.projects.list);
  const { isAuthenticated, initialized } = useAppSelector((state) => state.auth);
  const organization = useAppSelector((state) => state.organization);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUsersRequest());
    dispatch(fetchOrganizationRequest());
    // GET /notifications has no organization scoping at all server-side
    // (just recipientId) — fired here unconditionally, alongside users,
    // rather than gated on the org existing below.
    dispatch(fetchNotificationsRequest());
    // Bootstraps the users + organization + notifications slices exactly
    // once when the shell mounts. Auth session restoration is handled
    // globally by AuthBootstrap instead. Projects/members/tasks/activity
    // are fetched separately below, once the organization is confirmed to
    // exist (those endpoints 404 otherwise — see the org-existence guard).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const organizationId = organization.current?.id;
  useEffect(() => {
    if (!organizationId) return;
    dispatch(fetchProjectsRequest());
    dispatch(fetchMembersRequest());
    dispatch(fetchMyTasksRequest());
    dispatch(fetchActivityRequest());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId]);

  // Every page that renders inside AppShell is a protected page (see the
  // STANDALONE_ROUTES split in app/[...slug]/page.tsx). Wait for the
  // one-time session check (AuthBootstrap) to resolve before deciding —
  // redirecting on `initialized` alone avoids bouncing to /login during
  // the brief window before GET /auth/me has returned.
  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, isAuthenticated]);

  // Mirror image of the auth guard above: an authenticated user with no
  // OrganizationMember row yet (registered but never finished onboarding,
  // or came back later) gets bounced to /onboarding instead of rendering a
  // shell whose every fetch (projects, members) would 404.
  useEffect(() => {
    if (initialized && isAuthenticated && organization.hasNoOrganization) {
      router.push("/onboarding");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, isAuthenticated, organization.hasNoOrganization]);

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

  // Close any open task modal on route change — it looks its task up by id
  // in `projectTasks`, which gets overwritten wholesale by the next
  // project's fetch on navigation. Dispatching to the Redux store (as
  // opposed to `setMobileNavOpen` above, local to this component) belongs
  // in an effect, not the render body, since it can synchronously notify
  // other subscribed components mid-render.
  useEffect(() => {
    dispatch(closeTask());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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

  // Nothing to render yet: either the session check hasn't resolved, the
  // redirect above is already on its way to /login, the organization fetch
  // hasn't resolved/exists yet, or the org-guard redirect above is on its
  // way to /onboarding. The page-transition loader (mounted at the
  // Providers level) covers this window visually.
  if (!initialized || !isAuthenticated || !organization.current) {
    return null;
  }

  return (
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
      <CreateTaskModal />
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
      <TaskDetailModal />
    </div>
  );
}
