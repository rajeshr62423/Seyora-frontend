import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/types/project";
import type { User } from "@/types/user";

export default function UserCard({ user, projects }: { user: User; projects: Project[] }) {
  const memberProjects = projects.filter((p) => p.team.some((m) => m.id === user.id));
  const assigned = memberProjects.reduce((sum, p) => sum + Math.max(1, Math.round(p.taskCount / p.team.length)), 0);
  const avgProgress = memberProjects.length
    ? Math.round(memberProjects.reduce((sum, p) => sum + p.progress, 0) / memberProjects.length)
    : 0;

  return (
    <div className="card member-card">
      <div className="member-head">
        <span className="avatar">{user.initials}</span>
        <div style={{ minWidth: 0 }}>
          <strong>{user.name}</strong>
          <div className="member-role">
            <span className="presence" />
            {user.role}
          </div>
        </div>
        <Link href={`/users/${user.id}`} className="icon-btn" style={{ width: 30, height: 30, marginLeft: "auto" }} aria-label="View profile">
          <MoreHorizontal size={16} />
        </Link>
      </div>

      <div className="member-metrics">
        <div className="member-metric">
          <b>{assigned}</b>
          <span>Assigned</span>
        </div>
        <div className="member-metric">
          <b>{memberProjects.length}</b>
          <span>Projects</span>
        </div>
        <div className="member-metric">
          <b>{avgProgress}%</b>
          <span>Avg. progress</span>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
        <span className="tiny muted">{user.email}</span>
        <Link href={`/users/${user.id}`} className="btn ghost" style={{ height: 28, padding: "0 8px" }}>
          View profile
        </Link>
      </div>
    </div>
  );
}
