"use client";

import { Form, Input } from "antd";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { useAppRouter } from "@/lib/hooks/use-app-router";
import { useMessage } from "@/lib/hooks/use-message";
import AuthLayout from "./AuthLayout";

interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const router = useAppRouter();
  const message = useMessage();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agree: false,
    },
  });

  const password = watch("password");

  const onSubmit = () => {
    message.success("Let's set up your workspace");
    router.push("/onboarding");
  };

  return (
    <AuthLayout
      heroTitle="Engineering work, without the busywork."
      heroDescription="Plan projects, ship features, collaborate with your team and connect engineering signals in one focused workspace."
      stats={[
        { value: "248", label: "active tasks" },
        { value: "84%", label: "completion rate" },
        { value: "32", label: "team members" },
      ]}
    >
      <h2 className="auth-title">Create your account</h2>
      <div className="auth-sub">Join your engineering team on Seyora.</div>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          label="Full name"
          validateStatus={errors.fullName ? "error" : ""}
          help={errors.fullName?.message}
        >
          <Controller
            name="fullName"
            control={control}
            rules={{ required: "Full name is required" }}
            render={({ field }) => (
              <Input {...field} placeholder="John Anderson" />
            )}
          />
        </Form.Item>
        <Form.Item
          label="Email"
          validateStatus={errors.email ? "error" : ""}
          help={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: { value: EMAIL_PATTERN, message: "Enter a valid email" },
            }}
            render={({ field }) => (
              <Input {...field} placeholder="john@acme.dev" />
            )}
          />
        </Form.Item>
        <Form.Item
          label="Password"
          validateStatus={errors.password ? "error" : ""}
          help={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
              minLength: { value: 8, message: "At least 8 characters" },
            }}
            render={({ field }) => (
              <Input.Password {...field} placeholder="••••••••" />
            )}
          />
        </Form.Item>
        <Form.Item
          label="Confirm password"
          validateStatus={errors.confirmPassword ? "error" : ""}
          help={errors.confirmPassword?.message}
        >
          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: "Confirm your password",
              validate: (v) => v === password || "Passwords do not match",
            }}
            render={({ field }) => (
              <Input.Password {...field} placeholder="••••••••" />
            )}
          />
        </Form.Item>
        <Form.Item
          validateStatus={errors.agree ? "error" : ""}
          help={errors.agree?.message}
        >
          <Controller
            name="agree"
            control={control}
            rules={{ validate: (v) => v || "You must agree to continue" }}
            render={({ field: { value, onChange } }) => (
              <label className="small" style={{ display: "flex", gap: 7 }}>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => onChange(e.target.checked)}
                />
                I agree to the Terms and Privacy Policy
              </label>
            )}
          />
        </Form.Item>
        <button
          type="submit"
          className="btn primary"
          style={{ width: "100%", justifyContent: "center" }}
        >
          Create account
        </button>
      </Form>
      <div className="divider">OR</div>
      <div className="social">
        <button
          type="button"
          className="btn"
          style={{ justifyContent: "center" }}
          onClick={() => message.info("Social login is not part of this demo.")}
        >
          Google
        </button>
        <button
          type="button"
          className="btn"
          style={{ justifyContent: "center" }}
          onClick={() => message.info("Social login is not part of this demo.")}
        >
          GitHub
        </button>
      </div>
      <div className="auth-foot">
        Already have an account?{" "}
        <Link href="/login" className="link">
          Login
        </Link>
      </div>
    </AuthLayout>
  );
}
