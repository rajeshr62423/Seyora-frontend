"use client";

import { DatePicker, Form, Input, Modal, Select } from "antd";
import type { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMessage } from "@/lib/hooks/use-message";
import { scrollableModalStyles } from "@/lib/modal-styles";
import { TASK_PRIORITY_LABEL } from "@/lib/status";
import { closeCreateTaskModal, createTaskRequest } from "@/redux/tasks/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { TaskPriority } from "@/types/task";

const { TextArea } = Input;

interface CreateTaskFormFields {
  projectId: string;
  title: string;
  description?: string;
  priority: TaskPriority | undefined;
  assigneeId?: string;
  dueDate: Dayjs | null;
}

const DEFAULT_VALUES: CreateTaskFormFields = {
  projectId: "",
  title: "",
  description: "",
  priority: "MEDIUM",
  assigneeId: undefined,
  dueDate: null,
};

export default function CreateTaskModal() {
  const dispatch = useAppDispatch();
  const { createTaskContext, creating, createError } = useAppSelector(
    (state) => state.tasks,
  );
  const projects = useAppSelector((state) => state.projects.list);
  const organizationState = useAppSelector((state) => state.organization);
  const message = useMessage();
  const [attempted, setAttempted] = useState(false);
  const open = createTaskContext !== null;
  const presetProjectId = createTaskContext?.projectId;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskFormFields>({
    defaultValues: DEFAULT_VALUES,
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!open) reset(DEFAULT_VALUES);
    else reset({ ...DEFAULT_VALUES, projectId: presetProjectId ?? "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!attempted || creating) return;
    if (createError) {
      message.error(createError);
    } else {
      message.success("Task created");
      dispatch(closeCreateTaskModal());
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttempted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempted, creating, createError]);

  const onSubmit = (values: CreateTaskFormFields) => {
    if (!values.priority || !values.projectId) return;
    setAttempted(true);
    dispatch(
      createTaskRequest({
        projectId: values.projectId,
        status: createTaskContext?.status,
        values: {
          title: values.title,
          description: values.description,
          priority: values.priority,
          assigneeId: values.assigneeId,
          dueDate: values.dueDate
            ? values.dueDate.format("YYYY-MM-DD")
            : undefined,
        },
      }),
    );
  };

  return (
    <Modal
      title="Create task"
      open={open}
      onCancel={() => dispatch(closeCreateTaskModal())}
      onOk={handleSubmit(onSubmit)}
      okText="Create task"
      cancelText="Cancel"
      confirmLoading={creating}
      destroyOnHidden
      centered
      styles={scrollableModalStyles}
    >
      <Form
        layout="vertical"
        onFinish={handleSubmit(onSubmit)}
        className="card-pad"
        style={{ padding: "4px 0 0" }}
      >
        {!presetProjectId ? (
          <Form.Item
            label="Project"
            required
            validateStatus={errors.projectId ? "error" : ""}
            help={errors.projectId?.message}
          >
            <Controller
              name="projectId"
              control={control}
              rules={{ required: "Select a project" }}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Select a project"
                  options={projects.map((p) => ({
                    value: p.id,
                    label: p.name,
                  }))}
                />
              )}
            />
          </Form.Item>
        ) : null}

        <Form.Item
          label="Task title"
          required
          validateStatus={errors.title ? "error" : ""}
          help={errors.title?.message}
        >
          <Controller
            name="title"
            control={control}
            rules={{ required: "Task title is required" }}
            render={({ field }) => (
              <Input {...field} placeholder="e.g. Fix login redirect" />
            )}
          />
        </Form.Item>

        <Form.Item label="Description">
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                rows={3}
                placeholder="What needs to be done?"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Priority"
          required
          validateStatus={errors.priority ? "error" : ""}
          help={errors.priority?.message}
        >
          <Controller
            name="priority"
            control={control}
            rules={{ required: "Select a priority" }}
            render={({ field }) => (
              <Select
                {...field}
                options={(
                  Object.keys(TASK_PRIORITY_LABEL) as TaskPriority[]
                ).map((value) => ({
                  value,
                  label: TASK_PRIORITY_LABEL[value],
                }))}
              />
            )}
          />
        </Form.Item>

        <Form.Item label="Assignee">
          <Controller
            name="assigneeId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                allowClear
                placeholder="Unassigned"
                loading={organizationState.membersLoading}
                options={organizationState.members.map((m) => ({
                  value: m.user.id,
                  label: m.user.name,
                }))}
              />
            )}
          />
        </Form.Item>

        <Form.Item label="Due date">
          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <DatePicker {...field} style={{ width: "100%" }} />
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
