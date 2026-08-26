"use client";

import { notFound } from "next/navigation";
import { useMemo } from "react";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import { generateProjectTasks } from "@/lib/data/tasks";
import { useProjects } from "@/lib/context/projects-context";
import { useSelectedTask } from "@/lib/context/selected-task-context";
import ProjectHeaderCard from "./ProjectHeaderCard";

export default function ProjectCalendarPage({ slug }: { slug: string }) {
  const { getProjectBySlug } = useProjects();
  const project = getProjectBySlug(slug);
  const { openTask } = useSelectedTask();
  const tasks = useMemo(() => (project ? generateProjectTasks(project) : []), [project]);

  if (!project) notFound();

  const chips = tasks.map((t) => ({ id: t.id, label: t.title, date: t.dueDate, onClick: () => openTask(t) }));

  return (
    <div className="page">
      <ProjectHeaderCard project={project} activeTab="Calendar" />
      <div style={{ marginTop: 14 }}>
        <CalendarGrid chips={chips} />
      </div>
    </div>
  );
}
