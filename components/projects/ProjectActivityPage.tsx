"use client";

import { notFound } from "next/navigation";
import { useMemo } from "react";
import ActivityFeed from "@/components/activity/ActivityFeed";
import { useProjectBySlug } from "@/lib/hooks/use-project-by-slug";
import { useProjectTasks } from "@/lib/hooks/use-project-tasks";
import { useAppSelector } from "@/redux/hooks";
import ProjectHeaderCard from "./ProjectHeaderCard";

export default function ProjectActivityPage({ slug }: { slug: string }) {
  const { project, loading } = useProjectBySlug(slug);
  const { tasks } = useProjectTasks(project?.id);
  const items = useAppSelector((state) => state.activity.items);

  // Real join filter, not a target-string substring match: an ActivityEntry
  // has no projectId (task-level entries store the task's own id as
  // targetId), so "this project's activity" = project-type entries for
  // this project, plus task-type entries whose targetId is one of this
  // project's (already-fetched) task ids. Bounded by whatever page of
  // org-wide activity was fetched app-wide — see AppShell's bootstrap.
  const projectActivity = useMemo(() => {
    if (!project) return [];
    const taskIds = new Set(tasks.map((t) => t.id));
    return items.filter(
      (entry) =>
        (entry.targetType === "project" && entry.targetId === project.id) ||
        (entry.targetType === "task" && taskIds.has(entry.targetId)),
    );
  }, [items, project, tasks]);

  if (loading && !project) return null;
  if (!project) notFound();

  return (
    <div className="page">
      <ProjectHeaderCard project={project} activeTab="Activity" />
      <div className="card" style={{ marginTop: 14 }}>
        <div className="panel-head">
          <span className="card-title">Recent activity</span>
        </div>
        <div className="panel-body">
          <ActivityFeed entries={projectActivity} />
        </div>
      </div>
    </div>
  );
}
