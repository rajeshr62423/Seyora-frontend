"use client";

import { Form, Input } from "antd";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { resetPasswordRequest } from "@/lib/api/auth";
import { useAppRouter } from "@/lib/hooks/use-app-router";
import { useMessage } from "@/lib/hooks/use-message";
import AuthLayout from "./AuthLayout";

interface ResetFormValues {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const token = useSearchParams().get("token");
  const router = useAppRouter();
  const message = useMessage();
  const [submitting, setSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetFormValues>({ defaultValues: { password: "", confirmPassword: "" } });

  const password = watch("password");
  const strength = Math.min(100, password.length * 12);

  const onSubmit = async (values: ResetFormValues) => {
    if (!token) return;
    setSubmitting(true);
    try {
      await resetPasswordRequest({ token, password: values.password, confirmPassword: values.confirmPassword });
      message.success("You can now sign in with your new password");
      router.push("/login");
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Unable to reset your password. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout
        heroTitle="Engineering work, without the busywork."
        heroDescription="Plan projects, ship features, collaborate with your team and connect engineering signals in one focused workspace."
      >
        <h2 className="auth-title">This link isn&rsquo;t valid</h2>
        <div className="auth-sub">
          This password reset link is missing its token. Request a new one to continue.
        </div>
        <button
          type="button"
          className="btn primary"
          style={{ width: "100%", justifyContent: "center", marginTop: 12 }}
          onClick={() => router.push("/forgot-password")}
        >
          Request a new link
        </button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      heroTitle="Engineering work, without the busywork."
      heroDescription="Plan projects, ship features, collaborate with your team and connect engineering signals in one focused workspace."
    >
      <h2 className="auth-title">Create new password</h2>
      <div className="auth-sub">Choose a strong password to secure your account.</div>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item label="New password" validateStatus={errors.password ? "error" : ""} help={errors.password?.message}>
          <Controller
            name="password"
            control={control}
            rules={{ required: "Password is required", minLength: { value: 8, message: "At least 8 characters" } }}
            render={({ field }) => <Input.Password {...field} placeholder="New password" autoComplete="new-password" />}
          />
        </Form.Item>
        {password ? (
          <div style={{ margin: "-10px 0 14px" }}>
            <div className="progress success">
              <span style={{ width: `${strength}%` }} />
            </div>
            <div className="tiny muted" style={{ marginTop: 4 }}>
              {strength >= 80 ? "Strong password" : strength >= 40 ? "Medium strength" : "Weak password"}
            </div>
          </div>
        ) : null}
        <Form.Item
          label="Confirm password"
          validateStatus={errors.confirmPassword ? "error" : ""}
          help={errors.confirmPassword?.message}
        >
          <Controller
            name="confirmPassword"
            control={control}
            rules={{ required: "Confirm your password", validate: (v) => v === password || "Passwords do not match" }}
            render={({ field }) => (
              <Input.Password {...field} placeholder="Confirm password" autoComplete="new-password" />
            )}
          />
        </Form.Item>
        <button
          type="submit"
          className="btn primary"
          style={{ width: "100%", justifyContent: "center" }}
          disabled={submitting}
        >
          {submitting ? "Resetting…" : "Reset password"}
        </button>
      </Form>
    </AuthLayout>
  );
}
