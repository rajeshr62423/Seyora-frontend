"use client";

import { Form, Input } from "antd";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { useAppRouter } from "@/lib/hooks/use-app-router";
import { useMessage } from "@/lib/hooks/use-message";
import AuthLayout from "./AuthLayout";

interface TwoFactorFormValues {
  code: string;
}

export default function TwoFactorPage() {
  const router = useAppRouter();
  const message = useMessage();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TwoFactorFormValues>({ defaultValues: { code: "" } });

  const onSubmit = () => {
    message.success("Welcome to Seyora");
    router.push("/dashboard");
  };

  return (
    <AuthLayout
      heroTitle="Engineering work, without the busywork."
      heroDescription="Plan projects, ship features, collaborate with your team and connect engineering signals in one focused workspace."
    >
      <h2 className="auth-title">Secure your account</h2>
      <div className="auth-sub">
        Enter the 6-digit code from your authenticator app.
      </div>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          validateStatus={errors.code ? "error" : ""}
          help={errors.code?.message}
        >
          <Controller
            name="code"
            control={control}
            rules={{
              required: "Enter the 6-digit code",
              pattern: { value: /^\d{6}$/, message: "Code must be 6 digits" },
            }}
            render={({ field }) => (
              <Input
                {...field}
                maxLength={6}
                placeholder="000000"
                style={{ fontSize: 20, letterSpacing: 8, textAlign: "center" }}
              />
            )}
          />
        </Form.Item>
        <button
          type="submit"
          className="btn primary"
          style={{ width: "100%", justifyContent: "center" }}
        >
          Verify code
        </button>
      </Form>
      <div className="auth-foot">
        <Link href="/login" className="link">
          Use a backup code
        </Link>
      </div>
    </AuthLayout>
  );
}
