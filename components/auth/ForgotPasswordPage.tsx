"use client";

import { Form, Input } from "antd";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import AuthLayout from "./AuthLayout";

interface ForgotFormValues {
  email: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({ defaultValues: { email: "john@acme.dev" } });

  return (
    <AuthLayout
      heroTitle="Engineering work, without the busywork."
      heroDescription="Plan projects, ship features, collaborate with your team and connect engineering signals in one focused workspace."
    >
      <h2 className="auth-title">Reset your password</h2>
      <div className="auth-sub">We&rsquo;ll send a secure reset link to your email.</div>
      {sentTo ? (
        <div className="empty" style={{ padding: "20px 0" }}>
          <div className="empty-icon" style={{ color: "var(--success)" }}>
            <CheckCircle2 size={22} />
          </div>
          <strong>Check your inbox</strong>
          <p className="small muted">A secure reset link was sent to {sentTo}.</p>
        </div>
      ) : (
        <Form layout="vertical" onFinish={handleSubmit((v) => setSentTo(v.email))}>
          <Form.Item label="Email" validateStatus={errors.email ? "error" : ""} help={errors.email?.message}>
            <Controller
              name="email"
              control={control}
              rules={{ required: "Email is required", pattern: { value: EMAIL_PATTERN, message: "Enter a valid email" } }}
              render={({ field }) => <Input {...field} placeholder="john@acme.dev" />}
            />
          </Form.Item>
          <button type="submit" className="btn primary" style={{ width: "100%", justifyContent: "center" }}>
            Send reset link
          </button>
        </Form>
      )}
      <div className="auth-foot">
        Remember your password? <Link href="/login" className="link">Login</Link>
      </div>
    </AuthLayout>
  );
}
