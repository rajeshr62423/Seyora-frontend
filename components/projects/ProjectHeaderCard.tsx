import { Folder } from "lucide-react";
import Link from "next/link";
import { formatDisplayDateFull } from "@/lib/format";
import type { Project } from "@/types/project";
import ProjectStatus from "./ProjectStatus";
import TeamAvatars from "./TeamAvatars";

const TABS = [
  { label: "Overview", suffix: "" },
  { label: "Board", suffix: "/board" },
  { label: "List", suffix: "/tasks" },
  { label: "Calendar", suffix: "/calendar" },
  { label: "Activity", suffix: "/activity" },
  { label: "Settings", suffix: "/settings" },
];

export default function ProjectHeaderCard({ project, activeTab }: { project: Project; activeTab: string }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 12,
            display: "grid",
            placeItems: "center",
            color: project.color,
            background: `${project.color}1f`,
            flexShrink: 0,
          }}
        >
          <Folder size={24} strokeWidth={1.8} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="tiny muted">
            <Link href="/projects" className="link">
              Projects
            </Link>{" "}
            / {project.name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 22, fontWeight: 760 }}>{project.name}</span>
            <ProjectStatus status={project.status} />
          </div>
          <div className="project-desc" style={{ marginTop: 4, minHeight: "auto" }}>
            {project.description}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 24, marginTop: 18, alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <div className="tiny muted">Due date</div>
          <strong className="small">{formatDisplayDateFull(project.dueDate)}</strong>
        </div>
        <div style={{ width: 150 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, marginBottom: 5 }}>
            <span className="muted">Progress</span>
            <strong>{project.progress}%</strong>
          </div>
          <div className="progress">
            <span style={{ width: `${project.progress}%`, background: project.color }} />
          </div>
        </div>
        <div>
          <div className="tiny muted">Members</div>
          <TeamAvatars team={project.team} max={5} />
        </div>
        <div>
          <div className="tiny muted">Tasks</div>
          <strong className="small">{project.taskCount}</strong>
        </div>
      </div>

      <div style={{ display: "flex", gap: 4, marginTop: 18, overflow: "auto" }}>
        {TABS.map((tab) => (
          <Link
            key={tab.label}
            href={`/projects/${project.slug}${tab.suffix}`}
            className={`tab ${activeTab === tab.label ? "active" : ""}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
