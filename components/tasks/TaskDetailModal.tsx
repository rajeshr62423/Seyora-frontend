"use client";

import { Modal } from "antd";
import { useState } from "react";
import { useMessage } from "@/lib/hooks/use-message";
import { scrollableModalStyles } from "@/lib/modal-styles";
import { TASK_PRIORITY_BADGE_CLASS, TASK_STATUS_BADGE_CLASS } from "@/lib/status";
import type { ProjectTask, WorkspaceTask } from "@/types/task";

const SUBTASKS = ["Set up API", "Create database schema", "Implement authentication", "Write tests"];

export type DetailTask = ProjectTask | WorkspaceTask;

function hasProjectName(task: DetailTask): task is WorkspaceTask {
  return "projectName" in task;
}

export default function TaskDetailModal({ task, onClose }: { task: DetailTask | null; onClose: () => void }) {
  const message = useMessage();
  const [checked, setChecked] = useState<boolean[]>([true, true, false, false]);

  return (
    <Modal
      title={task ? `${task.id} · Task details` : ""}
      open={!!task}
      onCancel={onClose}
      destroyOnHidden
      centered
      styles={scrollableModalStyles}
      footer={
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="button" className="btn" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              onClose();
              message.success("Task updated successfully");
            }}
          >
            Save changes
          </button>
        </div>
      }
    >
      {task ? (
        <div>
          <div style={{ fontSize: 19, fontWeight: 760, marginBottom: 8 }}>{task.title}</div>
          <div className="small muted" style={{ marginBottom: 18 }}>
            Implement the production-ready workflow with validation, tests and observability.
            {hasProjectName(task) ? ` This task is part of the ${task.projectName} project.` : ""}
          </div>
          <div className="grid g2">
            <div>
              <div className="tiny muted" style={{ marginBottom: 5 }}>
                Status
              </div>
              <span className={`badge ${TASK_STATUS_BADGE_CLASS[task.status]}`}>
                <span className="status-dot" />
                {task.status}
              </span>
            </div>
            <div>
              <div className="tiny muted" style={{ marginBottom: 5 }}>
                Priority
              </div>
              <span className={`badge ${TASK_PRIORITY_BADGE_CLASS[task.priority]}`}>{task.priority}</span>
            </div>
            <div>
              <div className="tiny muted" style={{ marginBottom: 5 }}>
                Assignee
              </div>
              <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                <span className="avatar" style={{ width: 22, height: 22, fontSize: 9 }}>
                  {task.assigneeInitials}
                </span>
                {task.assigneeName}
              </span>
            </div>
            <div>
              <div className="tiny muted" style={{ marginBottom: 5 }}>
                Due date
              </div>
              <strong className="small">{task.dueDate}</strong>
            </div>
          </div>
          <hr style={{ border: 0, borderTop: "1px solid var(--border)", margin: "18px 0" }} />
          <div className="card card-pad">
            <strong>Subtasks</strong>
            <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
              {SUBTASKS.map((label, i) => (
                <label key={label} style={{ display: "flex", gap: 8, fontSize: 11, alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={checked[i]}
                    onChange={() => setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 18 }}>
            <strong>Comments</strong>
            <textarea className="textarea" style={{ width: "100%", marginTop: 9 }} placeholder="Write a comment..." />
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
