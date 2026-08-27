"use client";

import { Input, Select } from "antd";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { useProjectBySlug } from "@/lib/hooks/use-project-by-slug";
import { useMessage } from "@/lib/hooks/use-message";
import { STATUS_LABEL } from "@/lib/status";
import { updateProjectRequest } from "@/redux/projects/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { ProjectStatus } from "@/types/project";
import ProjectHeaderCard from "./ProjectHeaderCard";

const { TextArea } = Input;

export default function ProjectSettingsPage({ slug }: { slug: string }) {
  const dispatch = useAppDispatch();
  const { project, loading } = useProjectBySlug(slug);
  const { updating, updateError } = useAppSelector((state) => state.projects);
  const message = useMessage();
  const [attempted, setAttempted] = useState(false);

  if (loading && !project) return null;
  if (!project) notFound();

  return (
    <ProjectSettingsForm
      project={project}
      updating={updating}
      updateError={updateError}
      attempted={attempted}
      setAttempted={setAttempted}
      message={message}
      dispatch={dispatch}
    />
  );
}

// Split out so its local form state (name/description/status) is only ever
// initialized once the parent has already confirmed `project` is loaded and
// present — a `useState(project?.name ?? "")` mounted before that would
// capture an empty initial value and never re-sync when the fetch resolves.
function ProjectSettingsForm({
  project,
  updating,
  updateError,
  attempted,
  setAttempted,
  message,
  dispatch,
}: {
  project: NonNullable<ReturnType<typeof useProjectBySlug>["project"]>;
  updating: boolean;
  updateError: string | null;
  attempted: boolean;
  setAttempted: (value: boolean) => void;
  message: ReturnType<typeof useMessage>;
  dispatch: ReturnType<typeof useAppDispatch>;
}) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [status, setStatus] = useState<ProjectStatus | undefined>(project.status);

  useEffect(() => {
    if (!attempted || updating) return;
    if (updateError) {
      message.error(updateError);
    } else {
      message.success("Project settings saved");
    }
    setAttempted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempted, updating, updateError]);

  const handleSave = () => {
    setAttempted(true);
    dispatch(updateProjectRequest({ id: project.id, values: { name, description, status } }));
  };

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
          <button type="button" className="btn primary" onClick={handleSave} disabled={updating}>
            {updating ? "Saving…" : "Save changes"}
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
