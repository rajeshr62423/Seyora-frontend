"use client";

import { DatePicker, Input, Modal, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { formatDisplayDate } from "@/lib/format";
import { useMessage } from "@/lib/hooks/use-message";
import { scrollableModalStyles } from "@/lib/modal-styles";
import { TASK_PRIORITY_LABEL, TASK_STATUS_LABEL } from "@/lib/status";
import {
  addCommentRequest,
  addSubtaskRequest,
  closeTask,
  deleteSubtaskRequest,
  updateSubtaskRequest,
  updateTaskRequest,
} from "@/redux/tasks/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { TaskPriority, TaskStatus } from "@/types/task";

const { TextArea } = Input;

export default function TaskDetailModal() {
  const dispatch = useAppDispatch();
  const message = useMessage();
  const {
    selectedTaskId,
    projectTasks,
    myTasks,
    updatingTaskIds,
    updateError,
    subtaskSaving,
    subtaskError,
    commentSending,
    commentError,
  } = useAppSelector((state) => state.tasks);
  const task = selectedTaskId
    ? (projectTasks.find((t) => t.id === selectedTaskId) ?? myTasks.find((t) => t.id === selectedTaskId))
    : undefined;

  // A task that was open can vanish from both lists (e.g. navigating to a
  // different project's board overwrites `projectTasks`) — auto-close
  // rather than render a stale/blank modal.
  useEffect(() => {
    if (selectedTaskId && !task) {
      dispatch(closeTask());
    }
  }, [selectedTaskId, task, dispatch]);

  useEffect(() => {
    if (updateError) message.error(updateError);
  }, [updateError, message]);
  useEffect(() => {
    if (subtaskError) message.error(subtaskError);
  }, [subtaskError, message]);
  useEffect(() => {
    if (commentError) message.error(commentError);
  }, [commentError, message]);

  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [commentBody, setCommentBody] = useState("");

  if (!task) {
    return <Modal open={false} footer={null} title="" onCancel={() => dispatch(closeTask())} />;
  }

  const isUpdating = updatingTaskIds.includes(task.id);

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

  return (
    <Modal
      title={`${task.code} · Task details`}
      open={!!selectedTaskId}
      onCancel={() => dispatch(closeTask())}
      destroyOnHidden
      centered
      styles={scrollableModalStyles}
      footer={
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="button" className="btn" onClick={() => dispatch(closeTask())}>
            Close
          </button>
        </div>
      }
    >
      <div>
        <Input
          defaultValue={task.title}
          key={`${task.id}-title`}
          onBlur={(e) => {
            const value = e.target.value.trim();
            if (value && value !== task.title) {
              dispatch(updateTaskRequest({ id: task.id, values: { title: value } }));
            }
          }}
          style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}
        />
        <TextArea
          defaultValue={task.description}
          key={`${task.id}-description`}
          placeholder="Add a description…"
          rows={2}
          onBlur={(e) => {
            const value = e.target.value;
            if (value !== task.description) {
              dispatch(updateTaskRequest({ id: task.id, values: { description: value } }));
            }
          }}
          style={{ marginBottom: 18 }}
        />

        <div className="grid g2">
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
              onChange={(status) => dispatch(updateTaskRequest({ id: task.id, values: { status } }))}
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
              onChange={(priority) => dispatch(updateTaskRequest({ id: task.id, values: { priority } }))}
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
              options={
                task.assignee ? [{ value: task.assigneeId!, label: task.assignee.name }] : []
              }
              onChange={(assigneeId) =>
                dispatch(updateTaskRequest({ id: task.id, values: { assigneeId: assigneeId ?? null } }))
              }
            />
          </div>
          <div>
            <div className="tiny muted" style={{ marginBottom: 5 }}>
              Due date
            </div>
            <DatePicker
              value={task.dueDate ? dayjs(task.dueDate) : null}
              style={{ width: "100%" }}
              onChange={(date) =>
                dispatch(updateTaskRequest({ id: task.id, values: { dueDate: date ? date.format("YYYY-MM-DD") : undefined } }))
              }
            />
          </div>
        </div>

        <hr style={{ border: 0, borderTop: "1px solid var(--border)", margin: "18px 0" }} />

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
                  onClick={() => dispatch(deleteSubtaskRequest({ taskId: task.id, subtaskId: subtask.id }))}
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

        <div style={{ marginTop: 18 }}>
          <strong>Comments</strong>
          <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
            {task.comments.map((comment) => (
              <div key={comment.id} style={{ display: "flex", gap: 8 }}>
                <span className="avatar" style={{ width: 24, height: 24, fontSize: 9 }}>
                  {comment.author.initials}
                </span>
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
            <button type="button" className="btn primary" disabled={commentSending || !commentBody.trim()} onClick={handleAddComment}>
              {commentSending ? "Posting…" : "Post comment"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
