"use client";

import { notFound } from "next/navigation";
import ActivityFeed from "@/components/activity/ActivityFeed";
import { workspaceActivity } from "@/lib/data/activity";
import { useProjects } from "@/lib/context/projects-context";
import ProjectHeaderCard from "./ProjectHeaderCard";

export default function ProjectActivityPage({ slug }: { slug: string }) {
  const { getProjectBySlug } = useProjects();
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const entries = workspaceActivity.filter((a) => a.target.includes(project.name));
  const feed = entries.length ? entries : workspaceActivity.slice(0, 4);

  return (
    <div className="page">
      <ProjectHeaderCard project={project} activeTab="Activity" />
      <div className="card" style={{ marginTop: 14 }}>
        <div className="panel-head">
          <span className="card-title">Recent activity</span>
        </div>
        <div className="panel-body">
          <ActivityFeed entries={feed} />
        </div>
      </div>
    </div>
  );
}
