"use client";

import { notFound } from "next/navigation";
import { useMemo } from "react";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import { useProjectBySlug } from "@/lib/hooks/use-project-by-slug";
import { useProjectTasks } from "@/lib/hooks/use-project-tasks";
import { openTask } from "@/redux/tasks/action";
import { useAppDispatch } from "@/redux/hooks";
import ProjectHeaderCard from "./ProjectHeaderCard";

export default function ProjectCalendarPage({ slug }: { slug: string }) {
  const dispatch = useAppDispatch();
  const { project, loading: projectLoading } = useProjectBySlug(slug);
  const { tasks } = useProjectTasks(project?.id);

  // Undated tasks have nothing to plot on a calendar — excluded, not an
  // error.
  const chips = useMemo(
    () =>
      tasks
        .filter((t) => t.dueDate !== null)
        .map((t) => ({ id: t.id, label: t.title, date: t.dueDate!, onClick: () => dispatch(openTask(t.id)) })),
    [tasks, dispatch],
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
