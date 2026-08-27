import { isDueThisMonth } from "@/lib/format";
import type { Project } from "@/types/project";

export default function ProjectSummary({ projects }: { projects: Project[] }) {
  const total = projects.length;
  const active = projects.filter((p) => p.status === "IN_PROGRESS" || p.status === "IN_REVIEW").length;
  const onTrack = projects.filter((p) => p.status === "ON_TRACK" || p.status === "IN_PROGRESS").length;
  const onTrackPct = total ? Math.round((onTrack / total) * 100) : 0;
  const dueThisMonth = projects.filter((p) => isDueThisMonth(p.dueDate)).length;

  return (
    <div className="project-overview-strip">
      <div className="card project-stat">
        <div className="project-stat-label">
          <span>Total projects</span>
          <span className="trend up">+{Math.max(0, total - 4)}</span>
        </div>
        <div className="project-stat-value">{total}</div>
      </div>
      <div className="card project-stat">
        <div className="project-stat-label">
          <span>Active</span>
          <span className="badge badge-progressing">Live</span>
        </div>
        <div className="project-stat-value">{active}</div>
      </div>
      <div className="card project-stat">
        <div className="project-stat-label">
          <span>On track</span>
          <span className="trend up">{onTrackPct}%</span>
        </div>
        <div className="project-stat-value">{onTrack}</div>
      </div>
      <div className="card project-stat">
        <div className="project-stat-label">
          <span>Due this month</span>
          <span className={`trend ${dueThisMonth ? "down" : "up"}`}>{dueThisMonth}</span>
        </div>
        <div className="project-stat-value">{dueThisMonth}</div>
      </div>
    </div>
  );
}
