"use client";

import { DatePicker, Dropdown, Input, Select, type MenuProps } from "antd";
import dayjs from "dayjs";
import { MoreVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import Avatar from "@/components/common/Avatar";
import { formatDisplayDate, formatExactDateTime } from "@/lib/format";
import { useAppRouter } from "@/lib/hooks/use-app-router";
import { useConfirm } from "@/lib/hooks/use-confirm";
import { useMessage } from "@/lib/hooks/use-message";
import { useTaskActivity } from "@/lib/hooks/use-task-activity";
import { useTaskByCode } from "@/lib/hooks/use-task-by-code";
import { TASK_PRIORITY_BADGE_CLASS, TASK_PRIORITY_LABEL, TASK_STATUS_BADGE_CLASS, TASK_STATUS_LABEL } from "@/lib/status";
import {
  addCommentRequest,
  addSubtaskRequest,
  deleteSubtaskRequest,
  deleteTaskRequest,
  updateSubtaskRequest,
  updateTaskRequest,
} from "@/redux/tasks/action";
import type { UpdateTaskPayload } from "@/redux/tasks/type";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { TaskPriority, TaskStatus } from "@/types/task";

const { TextArea } = Input;

export default function TaskDetailPage({ code }: { code: string }) {
  const dispatch = useAppDispatch();
  const router = useAppRouter();
  const message = useMessage();
  const confirm = useConfirm();
  const { task, loading } = useTaskByCode(code);
  const {
    updatingTaskIds,
    updateError,
    subtaskSaving,
    subtaskError,
    commentSending,
    commentError,
    deletingTask,
    deleteTaskError,
  } = useAppSelector((state) => state.tasks);
  const members = useAppSelector((state) => state.organization.members);
  const { items: activityItems, loading: activityLoading } = useTaskActivity(task?.id);

  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [commentBody, setCommentBody] = useState("");

  useEffect(() => {
    if (updateError) message.error(updateError);
  }, [updateError, message]);
  useEffect(() => {
    if (subtaskError) message.error(subtaskError);
  }, [subtaskError, message]);
  useEffect(() => {
    if (commentError) message.error(commentError);
  }, [commentError, message]);
  useEffect(() => {
    if (deleteTaskError) message.error(deleteTaskError);
  }, [deleteTaskError, message]);

  // Scoped to updates made from this page — same reasoning as the modal
  // this page replaces had: kanban drag dispatches the same action, and
  // toasting on every drag would be noisy when the card moving column is
  // already the feedback.
  const [attemptedUpdate, setAttemptedUpdate] = useState(false);
  useEffect(() => {
    if (!attemptedUpdate) return;
    const stillUpdating = task ? updatingTaskIds.includes(task.id) : false;
    if (stillUpdating) return;
    if (!updateError) message.success("Task updated");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttemptedUpdate(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptedUpdate, updatingTaskIds, task, updateError]);

  const [attemptedDelete, setAttemptedDelete] = useState(false);
  useEffect(() => {
    if (!attemptedDelete || deletingTask) return;
    if (!deleteTaskError) {
      message.success("Task deleted");
      router.push("/tasks");
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttemptedDelete(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptedDelete, deletingTask, deleteTaskError]);

  // Mirrors ProjectDetailsPage/UserDetailsPage's exact loading/not-found
  // handling: render nothing while the fetch is still in flight (the
  // global page-transition loader covers this window), only declare
  // not-found once loading has genuinely settled with no task.
  if (loading && !task) return null;
  if (!task) notFound();

  const isUpdating = updatingTaskIds.includes(task.id);

  const applyUpdate = (values: UpdateTaskPayload["values"]) => {
    setAttemptedUpdate(true);
    dispatch(updateTaskRequest({ id: task.id, values }));
  };

  const handleAddSubtask = () => {
    const title = newSubtaskTitle.trim();
    if (!title) return;
    dispatch(addSubtaskRequest({ taskId: task.id, title }));
    setNewSubtaskTitle("");
  };

  const handleAddComment = () => {
    const body = commentBody.trim();
    if (!body) return;
    dispatch(addCommentRequest({ taskId: task.id, body }));
    setCommentBody("");
  };

  const menuItems: MenuProps["items"] = [{ key: "delete", label: "Delete task", danger: true }];
  const handleMenuClick: MenuProps["onClick"] = ({ key, domEvent }) => {
    domEvent.stopPropagation();
    domEvent.preventDefault();
    if (key !== "delete") return;
    confirm({
      title: "Delete this task?",
      content: `"${task.title}" and its subtasks and comments will be permanently deleted.`,
      okText: "Delete",
      onConfirm: () => {
        setAttemptedDelete(true);
        dispatch(deleteTaskRequest(task.id));
      },
    });
  };

  // Comments already have their own section below — showing "commented on
  // task" here too would duplicate every comment as a second entry.
  const timelineEntries = activityItems.filter((entry) => entry.action !== "commented on task");

  return (
    <div className="page">
      <Link href="/tasks" className="link tiny">
        ← Back to Tasks
      </Link>

      <div style={{ marginTop: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div className="eyebrow">{task.code} · Task details</div>
          <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} trigger={["click"]}>
            <button
              type="button"
              className="icon-btn"
              aria-label="Task actions"
              style={{ flexShrink: 0 }}
              onClick={(e) => e.preventDefault()}
            >
              <MoreVertical size={16} />
            </button>
          </Dropdown>
        </div>
        <Input
          defaultValue={task.title}
          key={`${task.id}-title`}
          onBlur={(e) => {
            const value = e.target.value.trim();
            if (value && value !== task.title) applyUpdate({ title: value });
          }}
          style={{ fontSize: 20, fontWeight: 700, marginTop: 6, marginBottom: 8 }}
        />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginTop: 4 }}>
          <span className={`badge ${TASK_STATUS_BADGE_CLASS[task.status]}`}>
            <span className="status-dot" />
            {TASK_STATUS_LABEL[task.status]}
          </span>
          <span className={`badge ${TASK_PRIORITY_BADGE_CLASS[task.priority]}`}>{task.priority}</span>
          <span className="tiny muted" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Avatar url={task.assignee?.avatarUrl} initials={task.assignee?.initials ?? "—"} style={{ width: 22, height: 22, fontSize: 9 }} />
            {task.assignee?.name ?? "Unassigned"}
          </span>
          <span className="tiny muted">{task.dueDate ? formatDisplayDate(task.dueDate) : "No due date"}</span>
        </div>
      </div>

      <div className="grid g3" style={{ marginTop: 14 }}>
        <div style={{ gridColumn: "span 2", display: "grid", gap: 14 }}>
          <div className="card card-pad">
            <strong>Description</strong>
            <TextArea
              defaultValue={task.description}
              key={`${task.id}-description`}
              placeholder="Add a description…"
              rows={3}
              style={{ marginTop: 10 }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value !== task.description) applyUpdate({ description: value });
              }}
            />
          </div>

          <div className="card card-pad">
            <strong>Activity</strong>
            <div style={{ marginTop: 10, display: "grid", gap: 14 }}>
              {activityLoading && timelineEntries.length === 0 ? (
                <div className="tiny muted">Loading activity…</div>
              ) : timelineEntries.length === 0 ? (
                <div className="tiny muted">No activity yet.</div>
              ) : (
                timelineEntries.map((entry) => (
                  <div key={entry.id} style={{ display: "flex", gap: 8 }}>
                    <Avatar url={entry.actor.avatarUrl} initials={entry.actor.initials} style={{ width: 24, height: 24, fontSize: 9 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11 }}>
                        <strong>{entry.actor.name}</strong>
                      </div>
                      <div className="small" style={{ marginTop: 2 }}>
                        {entry.action.charAt(0).toUpperCase() + entry.action.slice(1)}
                      </div>
                      <div className="tiny muted" style={{ marginTop: 2 }}>
                        {formatExactDateTime(entry.createdAt)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card card-pad">
            <strong>Comments</strong>
            <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
              {task.comments.map((comment) => (
                <div key={comment.id} style={{ display: "flex", gap: 8 }}>
                  <Avatar url={comment.author.avatarUrl} initials={comment.author.initials} style={{ width: 24, height: 24, fontSize: 9 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11 }}>
                      <strong>{comment.author.name}</strong>{" "}
                      <span className="tiny muted">{formatDisplayDate(comment.createdAt)}</span>
                    </div>
                    <div className="small" style={{ marginTop: 2 }}>
                      {comment.body}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <textarea
                className="textarea"
                style={{ width: "100%" }}
                placeholder="Write a comment..."
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <button
                type="button"
                className="btn primary"
                disabled={commentSending || !commentBody.trim()}
                onClick={handleAddComment}
              >
                {commentSending ? "Posting…" : "Post comment"}
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
          <div className="card card-pad">
            <strong>Task Information</strong>
            <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
              <div>
                <div className="tiny muted" style={{ marginBottom: 5 }}>
                  Status
                </div>
                <Select<TaskStatus>
                  value={task.status}
                  style={{ width: "100%" }}
                  loading={isUpdating}
                  options={(Object.keys(TASK_STATUS_LABEL) as TaskStatus[]).map((value) => ({
                    value,
                    label: TASK_STATUS_LABEL[value],
                  }))}
                  onChange={(status) => applyUpdate({ status })}
                />
              </div>
              <div>
                <div className="tiny muted" style={{ marginBottom: 5 }}>
                  Priority
                </div>
                <Select<TaskPriority>
                  value={task.priority}
                  style={{ width: "100%" }}
                  loading={isUpdating}
                  options={(Object.keys(TASK_PRIORITY_LABEL) as TaskPriority[]).map((value) => ({
                    value,
                    label: TASK_PRIORITY_LABEL[value],
                  }))}
                  onChange={(priority) => applyUpdate({ priority })}
                />
              </div>
              <div>
                <div className="tiny muted" style={{ marginBottom: 5 }}>
                  Assignee
                </div>
                <Select
                  value={task.assigneeId ?? undefined}
                  allowClear
                  placeholder="Unassigned"
                  style={{ width: "100%" }}
                  loading={isUpdating}
                  options={members.map((m) => ({ value: m.user.id, label: m.user.name }))}
                  onChange={(assigneeId) => applyUpdate({ assigneeId: assigneeId ?? null })}
                />
              </div>
              <div>
                <div className="tiny muted" style={{ marginBottom: 5 }}>
                  Due date
                </div>
                <DatePicker
                  value={task.dueDate ? dayjs(task.dueDate) : null}
                  style={{ width: "100%" }}
                  onChange={(date) => applyUpdate({ dueDate: date ? date.format("YYYY-MM-DD") : undefined })}
                />
              </div>
            </div>
          </div>

          <div className="card card-pad">
            <strong>Subtasks</strong>
            <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
              {task.subtasks.map((subtask) => (
                <div key={subtask.id} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 11 }}>
                  <label style={{ display: "flex", gap: 8, alignItems: "center", flex: 1 }}>
                    <input
                      type="checkbox"
                      checked={subtask.done}
                      disabled={subtaskSaving}
                      onChange={() =>
                        dispatch(
                          updateSubtaskRequest({
                            taskId: task.id,
                            subtaskId: subtask.id,
                            values: { done: !subtask.done },
                          }),
                        )
                      }
                    />
                    <span style={{ textDecoration: subtask.done ? "line-through" : "none" }}>{subtask.title}</span>
                  </label>
                  <button
                    type="button"
                    className="icon-btn"
                    style={{ width: 22, height: 22 }}
                    aria-label="Remove subtask"
                    disabled={subtaskSaving}
                    onClick={() =>
                      confirm({
                        title: "Remove this subtask?",
                        content: `"${subtask.title}" will be deleted.`,
                        okText: "Remove",
                        onConfirm: () => dispatch(deleteSubtaskRequest({ taskId: task.id, subtaskId: subtask.id })),
                      })
                    }
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <Input
                placeholder="Add a subtask…"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onPressEnter={handleAddSubtask}
              />
              <button type="button" className="btn" disabled={subtaskSaving} onClick={handleAddSubtask}>
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
