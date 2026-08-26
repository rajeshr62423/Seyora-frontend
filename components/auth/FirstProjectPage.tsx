"use client";

import { Form, Input, Select } from "antd";
import { Controller, useForm } from "react-hook-form";
import { useProjects } from "@/lib/context/projects-context";
import { users } from "@/lib/data/users";
import { useAppRouter } from "@/lib/hooks/use-app-router";
import { useMessage } from "@/lib/hooks/use-message";
import type { ProjectStatus } from "@/types/project";
import AuthLayout, { ONBOARDING_STEPS } from "./AuthLayout";

interface FirstProjectFormValues {
  name: string;
  description: string;
  status: ProjectStatus;
}

export default function FirstProjectPage() {
  const router = useAppRouter();
  const message = useMessage();
  const { addProject } = useProjects();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FirstProjectFormValues>({
    defaultValues: {
      name: "Website Redesign",
      description: "Modernize the customer-facing experience.",
      status: "on-track",
    },
  });

  const onSubmit = (values: FirstProjectFormValues) => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    addProject(
      { name: values.name, description: values.description, status: values.status, team: [users[0].id], dueDate: dueDate.toISOString().slice(0, 10) },
      [users[0]]
    );
    message.success("Your first project was created");
    router.push("/dashboard");
  };

  return (
    <AuthLayout
      heroTitle="Ship your first project."
      heroDescription="Create a project to organize tasks, timelines and engineering collaboration."
      stats={ONBOARDING_STEPS}
      currentStep={3}
    >
      <h2 className="auth-title">Create your first project</h2>
      <div className="auth-sub">You can change these details later.</div>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item label="Project name" validateStatus={errors.name ? "error" : ""} help={errors.name?.message}>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Project name is required" }}
            render={({ field }) => <Input {...field} placeholder="Website Redesign" />}
          />
        </Form.Item>
        <Form.Item label="Description">
          <Controller
            name="description"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Modernize the customer-facing experience." />}
          />
        </Form.Item>
        <Form.Item label="Status">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={[
                  { value: "on-track", label: "On Track" },
                  { value: "in-progress", label: "In Progress" },
                  { value: "backlog", label: "Backlog" },
                ]}
              />
            )}
          />
        </Form.Item>
        <button type="submit" className="btn primary" style={{ width: "100%", justifyContent: "center", marginTop: 6 }}>
          Create project
        </button>
      </Form>
    </AuthLayout>
  );
}
