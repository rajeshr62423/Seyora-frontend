"use client";

import { Form, Input, Select } from "antd";
import { Controller, useForm } from "react-hook-form";
import { useAppRouter } from "@/lib/hooks/use-app-router";
import AuthLayout, { ONBOARDING_STEPS } from "./AuthLayout";

interface OnboardingFormValues {
  orgName: string;
  industry: string;
  teamSize: string;
}

export default function OnboardingPage() {
  const router = useAppRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    defaultValues: {
      orgName: "Chola Technology",
      industry: "Software development",
      teamSize: "11-50",
    },
  });

  return (
    <AuthLayout
      heroTitle="Set up your engineering workspace."
      heroDescription="Start with your organization, invite teammates and create the first project."
      stats={ONBOARDING_STEPS}
      currentStep={1}
    >
      <h2 className="auth-title">Create your organization</h2>
      <div className="auth-sub">A workspace for your engineering team.</div>
      <Form
        layout="vertical"
        onFinish={handleSubmit(() => router.push("/invite"))}
      >
        <Form.Item
          label="Organization name"
          validateStatus={errors.orgName ? "error" : ""}
          help={errors.orgName?.message}
        >
          <Controller
            name="orgName"
            control={control}
            rules={{ required: "Organization name is required" }}
            render={({ field }) => (
              <Input {...field} placeholder="Chola Technology" />
            )}
          />
        </Form.Item>
        <Form.Item label="Industry">
          <Controller
            name="industry"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Software development" />
            )}
          />
        </Form.Item>
        <Form.Item label="Team size">
          <Controller
            name="teamSize"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={[
                  { value: "1-10", label: "1–10" },
                  { value: "11-50", label: "11–50" },
                  { value: "51-200", label: "51–200" },
                  { value: "200+", label: "200+" },
                ]}
              />
            )}
          />
        </Form.Item>
        <div style={{ marginBottom: 6 }}>
          <label
            className="tiny muted"
            style={{ display: "block", marginBottom: 6 }}
          >
            Organization logo
          </label>
          <div
            className="card card-pad"
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <div className="project-icon">A</div>
            <span className="btn" style={{ pointerEvents: "none" }}>
              Upload logo
            </span>
          </div>
        </div>
        <button
          type="submit"
          className="btn primary"
          style={{ width: "100%", justifyContent: "center", marginTop: 12 }}
        >
          Continue
        </button>
      </Form>
    </AuthLayout>
  );
}
