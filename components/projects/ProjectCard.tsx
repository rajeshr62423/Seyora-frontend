"use client";

import { Dropdown, type MenuProps } from "antd";
import { Folder, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { formatDisplayDate } from "@/lib/format";
import { useMessage } from "@/lib/hooks/use-message";
import type { Project } from "@/types/project";
import ProjectStatus from "./ProjectStatus";
import TeamAvatars from "./TeamAvatars";

export default function ProjectCard({ project }: { project: Project }) {
  const message = useMessage();
  const menuItems: MenuProps["items"] = [
    { key: "open", label: "Open project" },
    { key: "edit", label: "Edit project" },
    { key: "archive", label: "Archive project" },
  ];

  const handleMenuClick: MenuProps["onClick"] = ({ key, domEvent }) => {
    domEvent.stopPropagation();
    domEvent.preventDefault();
    if (key === "archive") message.success(`${project.name} archived`);
    else message.info(`${project.name} · ${key === "open" ? "opening project" : "edit project"}`);
  };

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="card project-card"
      style={{ "--project-accent": project.color } as CSSProperties}
    >
      <div className="project-top">
        <div className="project-icon" style={{ color: project.color, background: `${project.color}1f` }}>
          <Folder size={18} strokeWidth={1.8} />
        </div>
        <div className="project-info">
          <div className="project-name">{project.name}</div>
          <div className="project-desc">{project.description}</div>
        </div>
        <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} trigger={["click"]}>
          <button
            type="button"
            className="icon-btn"
            style={{ width: 30, height: 30 }}
            aria-label="Project actions"
            onClick={(e) => e.preventDefault()}
          >
            <MoreHorizontal size={16} />
          </button>
        </Dropdown>
      </div>

      <div className="project-meta">
        <ProjectStatus status={project.status} />
        <div style={{ display: "flex", justifyContent: "space-between", margin: "15px 0 7px", fontSize: 10 }}>
          <span className="muted">Delivery progress</span>
          <strong>{project.progress}%</strong>
        </div>
        <div className="progress">
          <span style={{ width: `${project.progress}%`, background: project.color }} />
        </div>
        <div className="project-foot">
          <span>{project.taskCount} tasks</span>
          <TeamAvatars team={project.team} />
          <span>Due {formatDisplayDate(project.dueDate)}</span>
        </div>
      </div>
    </Link>
  );
}
