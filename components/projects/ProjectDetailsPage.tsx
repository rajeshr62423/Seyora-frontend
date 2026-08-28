"use client";

import { notFound } from "next/navigation";
import Avatar from "@/components/common/Avatar";
import { useProjectBySlug } from "@/lib/hooks/use-project-by-slug";
import { useProjectTasks } from "@/lib/hooks/use-project-tasks";
import { ORG_ROLE_LABEL } from "@/lib/status";
import { useAppSelector } from "@/redux/hooks";
import ProjectHeaderCard from "./ProjectHeaderCard";

export default function ProjectDetailsPage({ slug }: { slug: string }) {
  const { project, loading } = useProjectBySlug(slug);
  const { tasks } = useProjectTasks(project?.id);
  const orgMembers = useAppSelector((state) => state.organization.members);

  if (loading && !project) return null;
  if (!project) notFound();

  const today = new Date().toISOString().slice(0, 10);
  const completed = tasks.filter((t) => t.status === "DONE").length;
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS" || t.status === "IN_REVIEW").length;
  const overdue = tasks.filter((t) => t.status !== "DONE" && t.dueDate !== null && t.dueDate < today).length;

  return (
    <div className="page">
      <ProjectHeaderCard project={project} activeTab="Overview" />

      <div className="grid g4" style={{ marginTop: 14 }}>
        <div className="card kpi">
          <span className="kpi-label">Total tasks</span>
          <div className="kpi-value">{tasks.length}</div>
        </div>
        <div className="card kpi">
          <span className="kpi-label">Completed</span>
          <div className="kpi-value">{completed}</div>
        </div>
        <div className="card kpi">
          <span className="kpi-label">In progress</span>
          <div className="kpi-value">{inProgress}</div>
        </div>
        <div className="card kpi">
          <span className="kpi-label">Overdue</span>
          <div className="kpi-value">{overdue}</div>
          <div className={`trend ${overdue ? "down" : "up"}`}>{overdue ? "Needs attention" : "On schedule"}</div>
        </div>
      </div>

      <div className="grid g2" style={{ marginTop: 14 }}>
        <div className="card">
          <div className="panel-head">
            <span className="card-title">Team</span>
          </div>
          <div className="panel-body">
            {project.team.map((member) => {
              const orgRole = orgMembers.find((m) => m.userId === member.id)?.role;
              return (
                <div key={member.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <Avatar url={member.avatarUrl} initials={member.initials} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 650 }}>{member.name}</div>
                    <div className="tiny muted">{orgRole ? ORG_ROLE_LABEL[orgRole] : "—"}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="card">
          <div className="panel-head">
            <span className="card-title">Project details</span>
          </div>
          <div className="panel-body" style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="tiny muted">Project ID</span>
              <strong className="small">{project.id}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="tiny muted">Created</span>
              <strong className="small">{project.createdAt}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="tiny muted">Last updated</span>
              <strong className="small">{project.updatedAt}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="tiny muted">Owner</span>
              <strong className="small">{project.owner.name}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
