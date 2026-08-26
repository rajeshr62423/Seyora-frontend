"use client";

import { notFound } from "next/navigation";
import { useProjects } from "@/lib/context/projects-context";
import ProjectHeaderCard from "./ProjectHeaderCard";

export default function ProjectDetailsPage({ slug }: { slug: string }) {
  const { getProjectBySlug } = useProjects();
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const completed = Math.round((project.progress / 100) * project.taskCount);
  const inProgress = Math.max(project.taskCount - completed - 1, 0);
  const overdue = project.status === "backlog" ? 1 : 0;

  return (
    <div className="page">
      <ProjectHeaderCard project={project} activeTab="Overview" />

      <div className="grid g4" style={{ marginTop: 14 }}>
        <div className="card kpi">
          <span className="kpi-label">Total tasks</span>
          <div className="kpi-value">{project.taskCount}</div>
        </div>
        <div className="card kpi">
          <span className="kpi-label">Completed</span>
          <div className="kpi-value">{completed}</div>
          <div className="trend up">+{Math.max(1, Math.round(project.progress / 10))}% this sprint</div>
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
            {project.team.map((member) => (
              <div key={member.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span className="avatar">{member.initials}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 650 }}>{member.name}</div>
                  <div className="tiny muted">{member.role}</div>
                </div>
              </div>
            ))}
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
              <strong className="small">{project.team[0]?.name ?? "Unassigned"}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
