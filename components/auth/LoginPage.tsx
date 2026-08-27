"use client";

import { Form, Input } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAppRouter } from "@/lib/hooks/use-app-router";
import { useMessage } from "@/lib/hooks/use-message";
import { getRememberedEmail } from "@/lib/api/remembered-email";
import { loginRequest } from "@/redux/auth/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
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
  const { loading, isAuthenticated, error } = useAppSelector((state) => state.auth);
  const [attempted, setAttempted] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "", remember: false },
  });

  // Defaults to "" on both server and first client render (SSR-safe, no
  // hydration mismatch), then fills in from localStorage right after mount —
  // same pattern as theme-context.tsx.
  useEffect(() => {
    const remembered = getRememberedEmail();
    if (remembered) {
      setValue("email", remembered);
      setValue("remember", true);
    }
  }, [setValue]);

  const onSubmit = (values: LoginFormValues) => {
    setAttempted(true);
    dispatch(loginRequest({ email: values.email, password: values.password, remember: values.remember }));
  };

  // Reacts once the saga resolves the dispatched login above — `attempted`
  // keeps the toast from firing on unrelated auth-state changes (e.g. a
  // session restore elsewhere landing isAuthenticated: true while this page
  // is open). Resetting it back to false here (not in the event handler) is
  // a deliberate, well-understood use of setState-in-effect.
  useEffect(() => {
    if (!attempted || loading) return;
    if (isAuthenticated) {
      message.success("You're signed in to Seyora");
    } else if (error) {
      message.error(error);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttempted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempted, loading, isAuthenticated, error]);

  // Separate from the toast above so it also covers an already-authenticated
  // visitor landing on /login directly (e.g. session restored from a prior
  // visit), not just a fresh submit.
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

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
              <Input {...field} placeholder="john@acme.dev" autoComplete="username" />
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
              <Input.Password {...field} placeholder="••••••••" autoComplete="current-password" />
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
