import { Folder } from "lucide-react";
import Link from "next/link";
import { formatDisplayDate } from "@/lib/format";
import type { Project } from "@/types/project";
import ProjectStatus from "./ProjectStatus";
import TeamAvatars from "./TeamAvatars";

export default function ProjectList({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;

  return (
    <div className="card project-list-card">
      <div className="table-wrap">
        <table className="project-list-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Tasks</th>
              <th>Due date</th>
              <th>Team</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>
                  <Link href={`/projects/${project.slug}`} className="pl-project">
                    <div className="pl-icon" style={{ color: project.color, background: `${project.color}1f` }}>
                      <Folder size={14} strokeWidth={1.8} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div className="pl-name">{project.name}</div>
                      <div className="pl-desc">{project.description}</div>
                    </div>
                  </Link>
                </td>
                <td>
                  <ProjectStatus status={project.status} />
                </td>
                <td>
                  <div className="pl-progress">
                    <div className="progress">
                      <span style={{ width: `${project.progress}%`, background: project.color }} />
                    </div>
                    <span className="pl-pct">{project.progress}%</span>
                  </div>
                </td>
                <td>{project.taskCount}</td>
                <td>{formatDisplayDate(project.dueDate)}</td>
                <td>
                  <TeamAvatars team={project.team} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
