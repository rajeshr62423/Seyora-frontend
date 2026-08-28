import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import AppShell from "@/components/layout/AppShell";
import AcceptInvitationPage from "@/components/auth/AcceptInvitationPage";
import DashboardPage from "@/components/dashboard/DashboardPage";
import ProjectActivityPage from "@/components/projects/ProjectActivityPage";
import ProjectBoardPage from "@/components/projects/ProjectBoardPage";
import ProjectCalendarPage from "@/components/projects/ProjectCalendarPage";
import ProjectDetailsPage from "@/components/projects/ProjectDetailsPage";
import ProjectSettingsPage from "@/components/projects/ProjectSettingsPage";
import ProjectTasksPage from "@/components/projects/ProjectTasksPage";
import ProjectsPage from "@/components/projects/ProjectsPage";
import CalendarPage from "@/components/calendar/CalendarPage";
import MyTasksPage from "@/components/tasks/MyTasksPage";
import TaskDetailPage from "@/components/tasks/TaskDetailPage";
import AnalyticsPage from "@/components/analytics/AnalyticsPage";
import ActivityPage from "@/components/activity/ActivityPage";
import NotificationsPage from "@/components/notifications/NotificationsPage";
import MessagesPage from "@/components/messages/MessagesPage";
import IntegrationsPage from "@/components/integrations/IntegrationsPage";
import GitHubPage from "@/components/integrations/GitHubPage";
import SearchPage from "@/components/search/SearchPage";
import SettingsShell from "@/components/settings/SettingsShell";
import UserDetailsPage from "@/components/users/UserDetailsPage";
import UsersPage from "@/components/users/UsersPage";
import ForgotPasswordPage from "@/components/auth/ForgotPasswordPage";
import InvitePage from "@/components/auth/InvitePage";
import FirstProjectPage from "@/components/auth/FirstProjectPage";
import LoginPage from "@/components/auth/LoginPage";
import OnboardingPage from "@/components/auth/OnboardingPage";
import RegisterPage from "@/components/auth/RegisterPage";
import ResetPasswordPage from "@/components/auth/ResetPasswordPage";
import TwoFactorPage from "@/components/auth/TwoFactorPage";
import VerifyEmailPage from "@/components/auth/VerifyEmailPage";

// Routes that render outside the AppShell (no sidebar/topbar) — the
// auth + onboarding flow, matching the source HTML's standalone layout.
const STANDALONE_ROUTES: Record<string, ReactNode> = {
  login: <LoginPage />,
  register: <RegisterPage />,
  "forgot-password": <ForgotPasswordPage />,
  // Reads ?token= via useSearchParams(), which requires a Suspense boundary
  // for static generation — same reasoning as the invitations/accept route
  // below.
  "reset-password": (
    <Suspense fallback={null}>
      <ResetPasswordPage />
    </Suspense>
  ),
  "verify-email": <VerifyEmailPage />,
  "2fa": <TwoFactorPage />,
  onboarding: <OnboardingPage />,
  invite: <InvitePage />,
  "first-project": <FirstProjectPage />,
};

function resolveAppContent(slug: string[]): ReactNode {
  const [first, second, third] = slug;

  if (first === "dashboard" && !second) return <DashboardPage />;

  if (first === "projects") {
    if (!second)
      return (
        <Suspense fallback={null}>
          <ProjectsPage />
        </Suspense>
      );
    if (!third) return <ProjectDetailsPage slug={second} />;
    if (third === "board") return <ProjectBoardPage slug={second} />;
    if (third === "tasks") return <ProjectTasksPage slug={second} />;
    if (third === "calendar") return <ProjectCalendarPage slug={second} />;
    if (third === "activity") return <ProjectActivityPage slug={second} />;
    if (third === "settings") return <ProjectSettingsPage slug={second} />;
    return null;
  }

  if (first === "tasks") {
    if (!second) return <MyTasksPage />;
    if (!third) return <TaskDetailPage code={second} />;
    return null;
  }
  if (first === "calendar" && !second) return <CalendarPage />;
  if (first === "analytics" && !second) return <AnalyticsPage />;
  if (first === "activity" && !second) return <ActivityPage />;
  if (first === "notifications" && !second) return <NotificationsPage />;
  if (first === "messages" && !second) return <MessagesPage />;
  if (first === "integrations" && !second) return <IntegrationsPage />;
  if (first === "github" && !second) return <GitHubPage />;
  if (first === "search" && !second) return <SearchPage />;

  if (first === "users") {
    if (!second) return <UsersPage />;
    return <UserDetailsPage userId={second} />;
  }

  if (first === "settings") {
    if (!second) return <SettingsShell activeTab="profile" />;
    if (!third) return <SettingsShell activeTab={second} />;
    return null;
  }

  return null;
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const [first, second] = slug;

  if (first in STANDALONE_ROUTES && slug.length === 1) {
    return STANDALONE_ROUTES[first];
  }

  // Where the invitation email's "Accept Invitation" button links —
  // deliberately standalone (no AppShell), same as the rest of the auth
  // flow, since the visitor isn't a member of any organization yet.
  if (first === "invitations" && second === "accept" && slug.length === 2) {
    return (
      <Suspense fallback={null}>
        <AcceptInvitationPage />
      </Suspense>
    );
  }

  const content = resolveAppContent(slug);
  if (!content) notFound();

  return <AppShell>{content}</AppShell>;
}
