"use client";

import { Input, Select } from "antd";
import { notFound } from "next/navigation";
import { useState } from "react";
import { useProjects } from "@/lib/context/projects-context";
import { useMessage } from "@/lib/hooks/use-message";
import { STATUS_LABEL } from "@/lib/status";
import type { ProjectStatus } from "@/types/project";
import ProjectHeaderCard from "./ProjectHeaderCard";

const { TextArea } = Input;

export default function ProjectSettingsPage({ slug }: { slug: string }) {
  const { getProjectBySlug } = useProjects();
  const project = getProjectBySlug(slug);
  const message = useMessage();

  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [status, setStatus] = useState<ProjectStatus | undefined>(project?.status);

  if (!project) notFound();

  return (
    <div className="page">
      <ProjectHeaderCard project={project} activeTab="Settings" />

      <div className="settings-content-card" style={{ marginTop: 14 }}>
        <h2>Project settings</h2>
        <p className="settings-desc">Update the name, description and delivery status for this project.</p>

        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <label className="tiny muted" style={{ display: "block", marginBottom: 6 }}>
              Project name
            </label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="tiny muted" style={{ display: "block", marginBottom: 6 }}>
              Description
            </label>
            <TextArea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div style={{ maxWidth: 260 }}>
            <label className="tiny muted" style={{ display: "block", marginBottom: 6 }}>
              Status
            </label>
            <Select<ProjectStatus>
              value={status}
              onChange={setStatus}
              style={{ width: "100%" }}
              options={(Object.keys(STATUS_LABEL) as ProjectStatus[]).map((value) => ({
                value,
                label: STATUS_LABEL[value],
              }))}
            />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 28 }}>
          <button type="button" className="btn primary" onClick={() => message.success("Project settings saved")}>
            Save changes
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: 14, borderColor: "rgba(248,113,113,.25)", background: "rgba(248,113,113,.04)" }}>
        <div className="card-pad">
          <strong style={{ color: "var(--danger)" }}>Danger zone</strong>
          <p className="small muted" style={{ margin: "8px 0 14px" }}>
            Archiving this project hides it from active views. This cannot be undone from the demo UI.
          </p>
          <button type="button" className="btn danger" onClick={() => message.warning(`"${project.name}" archive requested`)}>
            Archive project
          </button>
        </div>
      </div>
    </div>
  );
}
