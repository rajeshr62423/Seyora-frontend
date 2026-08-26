"use client";

import { Form, Input } from "antd";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { useAppRouter } from "@/lib/hooks/use-app-router";
import { useMessage } from "@/lib/hooks/use-message";
import { loginRequest } from "@/redux/auth/action";
import { useAppDispatch } from "@/redux/hooks";
import AuthLayout from "./AuthLayout";

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useAppRouter();
  const dispatch = useAppDispatch();
  const message = useMessage();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { email: "john@acme.dev", password: "", remember: false },
  });

  const onSubmit = (values: LoginFormValues) => {
    dispatch(loginRequest({ email: values.email, password: values.password }));
    message.success("You're signed in to Seyora");
    router.push("/dashboard");
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
      <h2 className="auth-title">Welcome back</h2>
      <div className="auth-sub">
        Sign in to continue to your Seyora workspace.
      </div>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
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
            rules={{ required: "Password is required" }}
            render={({ field }) => (
              <Input.Password {...field} placeholder="••••••••" />
            )}
          />
        </Form.Item>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "2px 0 12px",
          }}
        >
          <label
            className="small"
            style={{ display: "flex", gap: 7, alignItems: "center" }}
          >
            <Controller
              name="remember"
              control={control}
              render={({ field: { value, onChange } }) => (
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => onChange(e.target.checked)}
                />
              )}
            />
            Remember me
          </label>
          <Link href="/forgot-password" className="link tiny">
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          className="btn primary"
          style={{ width: "100%", justifyContent: "center" }}
        >
          Login
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
        Don&rsquo;t have an account?{" "}
        <Link href="/register" className="link">
          Register
        </Link>
      </div>
    </AuthLayout>
  );
}
