"use client";

import { DatePicker, Form, Input, Modal, Select } from "antd";
import type { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAppRouter } from "@/lib/hooks/use-app-router";
import { useMessage } from "@/lib/hooks/use-message";
import { scrollableModalStyles } from "@/lib/modal-styles";
import { STATUS_LABEL } from "@/lib/status";
import { closeCreateProjectModal, createProjectRequest } from "@/redux/projects/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { ProjectStatus } from "@/types/project";

const { TextArea } = Input;

interface CreateProjectFormFields {
  name: string;
  description?: string;
  status: ProjectStatus | undefined;
  team: string[];
  dueDate: Dayjs | null;
}

const DEFAULT_VALUES: CreateProjectFormFields = {
  name: "",
  description: "",
  status: undefined,
  team: [],
  dueDate: null,
};

export default function CreateProjectModal() {
  const dispatch = useAppDispatch();
  const { isCreateModalOpen, creating, createError, list } = useAppSelector((state) => state.projects);
  const usersState = useAppSelector((state) => state.users);
  const router = useAppRouter();
  const message = useMessage();
  const [attempted, setAttempted] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectFormFields>({ defaultValues: DEFAULT_VALUES, mode: "onSubmit" });

  useEffect(() => {
    if (!isCreateModalOpen) reset(DEFAULT_VALUES);
  }, [isCreateModalOpen, reset]);

  const onSubmit = (values: CreateProjectFormFields) => {
    if (!values.status || !values.dueDate) return;
    setAttempted(true);
    dispatch(
      createProjectRequest({
        name: values.name,
        description: values.description,
        status: values.status,
        team: values.team,
        dueDate: values.dueDate.format("YYYY-MM-DD"),
      }),
    );
  };

  // Reacts once the saga resolves the dispatched create above — mirrors
  // LoginPage.tsx's attempted-flag pattern. `list[0]` is the just-created
  // project (the reducer prepends on success), used to navigate to its
  // real server-assigned slug.
  useEffect(() => {
    if (!attempted || creating) return;
    if (createError) {
      message.error(createError);
    } else {
      const created = list[0];
      if (created) {
        message.success(`"${created.name}" was added to your projects`);
        dispatch(closeCreateProjectModal());
        router.push(`/projects/${created.slug}`);
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttempted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempted, creating, createError]);

  return (
    <Modal
      title="Create project"
      open={isCreateModalOpen}
      onCancel={() => dispatch(closeCreateProjectModal())}
      onOk={handleSubmit(onSubmit)}
      okText="Create project"
      cancelText="Cancel"
      confirmLoading={creating}
      destroyOnHidden
      centered
      styles={scrollableModalStyles}
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className="card-pad" style={{ padding: "4px 0 0" }}>
        <Form.Item
          label="Project name"
          required
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            rules={{ required: "Project name is required" }}
            render={({ field }) => <Input {...field} placeholder="e.g. Developer Portal" />}
          />
        </Form.Item>

        <Form.Item label="Description">
          <Controller
            name="description"
            control={control}
            render={({ field }) => <TextArea {...field} rows={3} placeholder="What is this project about?" />}
          />
        </Form.Item>

        <Form.Item
          label="Status"
          required
          validateStatus={errors.status ? "error" : ""}
          help={errors.status?.message}
        >
          <Controller
            name="status"
            control={control}
            rules={{ required: "Select a status" }}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Select status"
                options={(Object.keys(STATUS_LABEL) as ProjectStatus[]).map((value) => ({
                  value,
                  label: STATUS_LABEL[value],
                }))}
              />
            )}
          />
        </Form.Item>

        <Form.Item label="Team" required validateStatus={errors.team ? "error" : ""} help={errors.team?.message}>
          <Controller
            name="team"
            control={control}
            rules={{ required: "Assign at least one team member", validate: (v) => v.length > 0 || "Assign at least one team member" }}
            render={({ field }) => (
              <Select
                {...field}
                mode="multiple"
                placeholder="Assign team members"
                loading={usersState.loading}
                options={usersState.list.map((u) => ({ value: u.id, label: u.name }))}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Due date"
          required
          validateStatus={errors.dueDate ? "error" : ""}
          help={errors.dueDate?.message}
        >
          <Controller
            name="dueDate"
            control={control}
            rules={{ required: "Due date is required" }}
            render={({ field }) => <DatePicker {...field} style={{ width: "100%" }} />}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
