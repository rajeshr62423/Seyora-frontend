import { STATUS_BADGE_CLASS, STATUS_LABEL } from "@/lib/status";
import type { ProjectStatus as ProjectStatusType } from "@/types/project";

export default function ProjectStatus({ status }: { status: ProjectStatusType }) {
  return (
    <span className={`badge ${STATUS_BADGE_CLASS[status]}`}>
      <span className="status-dot" />
      {STATUS_LABEL[status]}
    </span>
  );
}
