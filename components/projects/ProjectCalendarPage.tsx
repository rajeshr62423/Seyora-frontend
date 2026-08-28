"use client";

import { notFound } from "next/navigation";
import { useMemo } from "react";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import { useAppRouter } from "@/lib/hooks/use-app-router";
import { useProjectBySlug } from "@/lib/hooks/use-project-by-slug";
import { useProjectTasks } from "@/lib/hooks/use-project-tasks";
import ProjectHeaderCard from "./ProjectHeaderCard";

export default function ProjectCalendarPage({ slug }: { slug: string }) {
  const router = useAppRouter();
  const { project, loading: projectLoading } = useProjectBySlug(slug);
  const { tasks } = useProjectTasks(project?.id);

  // Undated tasks have nothing to plot on a calendar — excluded, not an
  // error.
  const chips = useMemo(
    () =>
      tasks
        .filter((t) => t.dueDate !== null)
        .map((t) => ({ id: t.id, label: t.title, date: t.dueDate!, onClick: () => router.push(`/tasks/${t.code}`) })),
    [tasks, router],
  );

  if (projectLoading && !project) return null;
  if (!project) notFound();

  return (
    <div className="page">
      <ProjectHeaderCard project={project} activeTab="Calendar" />
      <div style={{ marginTop: 14 }}>
        <CalendarGrid chips={chips} />
      </div>
    </div>
  );
}
