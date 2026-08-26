"use client";

import { DatePicker, Form, Input, Modal, Select } from "antd";
import type { Dayjs } from "dayjs";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useProjects } from "@/lib/context/projects-context";
import { useMessage } from "@/lib/hooks/use-message";
import { scrollableModalStyles } from "@/lib/modal-styles";
import { STATUS_LABEL } from "@/lib/status";
import { useAppSelector } from "@/redux/hooks";
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
  const { isCreateModalOpen, closeCreateModal, addProject } = useProjects();
  const usersState = useAppSelector((state) => state.users);
  const message = useMessage();

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
    const team = usersState.list.filter((u) => values.team.includes(u.id));
    const created = addProject(
      {
        name: values.name,
        description: values.description,
        status: values.status,
        team: values.team,
        dueDate: values.dueDate.format("YYYY-MM-DD"),
      },
      team
    );
    message.success(`"${created.name}" was added to your projects`);
    closeCreateModal();
  };

  return (
    <Modal
      title="Create project"
      open={isCreateModalOpen}
      onCancel={closeCreateModal}
      onOk={handleSubmit(onSubmit)}
      okText="Create project"
      cancelText="Cancel"
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
