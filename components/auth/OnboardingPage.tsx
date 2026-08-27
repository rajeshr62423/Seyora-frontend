"use client";

import { Form, Input } from "antd";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAppRouter } from "@/lib/hooks/use-app-router";
import { useMessage } from "@/lib/hooks/use-message";
import { createOrganizationRequest } from "@/redux/organization/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import AuthLayout, { ONBOARDING_STEPS } from "./AuthLayout";

interface OnboardingFormValues {
  orgName: string;
}

export default function OnboardingPage() {
  const router = useAppRouter();
  const dispatch = useAppDispatch();
  const message = useMessage();
  const { creating, createError, current } = useAppSelector((state) => state.organization);
  const [attempted, setAttempted] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    defaultValues: { orgName: "Chola Technology" },
  });

  // Already has an organization — don't let a revisit to /onboarding create
  // a second, orphaned one. `!attempted` excludes the moment right after
  // this page's own submission succeeds (that case is handled by the
  // effect below, which navigates to /invite instead).
  useEffect(() => {
    if (current && !attempted) {
      router.push("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, attempted]);

  useEffect(() => {
    if (!attempted || creating) return;
    if (createError) {
      message.error(createError);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAttempted(false);
    } else if (current) {
      router.push("/invite");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempted, creating, createError, current]);

  const onSubmit = (values: OnboardingFormValues) => {
    setAttempted(true);
    dispatch(createOrganizationRequest({ name: values.orgName }));
  };

  return (
    <AuthLayout
      heroTitle="Set up your engineering workspace."
      heroDescription="Start with your organization, invite teammates and create the first project."
      stats={ONBOARDING_STEPS}
      currentStep={1}
    >
      <h2 className="auth-title">Create your organization</h2>
      <div className="auth-sub">A workspace for your engineering team.</div>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
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
          disabled={creating}
        >
          {creating ? "Creating…" : "Continue"}
        </button>
      </Form>
    </AuthLayout>
  );
}
