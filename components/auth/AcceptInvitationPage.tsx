"use client";

import { Form, Input } from "antd";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAppRouter } from "@/lib/hooks/use-app-router";
import { useMessage } from "@/lib/hooks/use-message";
import {
  acceptInvitation,
  getInvitationPreview,
  type InvitationPreview,
} from "@/lib/api/invitations";
import { ORG_ROLE_LABEL } from "@/lib/status";
import { loginRequest, logout, registerViaInvitationRequest } from "@/redux/auth/action";
import { fetchOrganizationRequest } from "@/redux/organization/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import AuthLayout from "./AuthLayout";

type PreviewStatus = "loading" | "error" | "ready";

interface CreateAccountFormValues {
  name: string;
  password: string;
  confirmPassword: string;
}

interface LoginFormValues {
  password: string;
}

// Resets default <button> chrome so a `.link`-styled toggle button reads as
// inline text, not a boxed browser button, matching every anchor-based
// `.link` elsewhere in the auth flow.
const LINK_BUTTON_STYLE: CSSProperties = {
  background: "none",
  border: "none",
  padding: 0,
  font: "inherit",
};

export default function AcceptInvitationPage() {
  const token = useSearchParams().get("token");
  const router = useAppRouter();
  const dispatch = useAppDispatch();
  const message = useMessage();
  const { user, isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  const [status, setStatus] = useState<PreviewStatus>("loading");
  const [preview, setPreview] = useState<InvitationPreview | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [mode, setMode] = useState<"create" | "login">("create");
  // Which form is in flight — needed because a successful "create" already
  // accepted the invitation server-side (one transaction, alongside the new
  // account), while a successful "login" hasn't accepted anything yet. Both
  // land in the same state.auth slice, so isAuthenticated alone can't tell
  // them apart.
  const [pendingAction, setPendingAction] = useState<"create" | "login" | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [acceptError, setAcceptError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setPreviewError("This invitation link is missing its token.");
      return;
    }
    getInvitationPreview(token)
      .then((result) => {
        setPreview(result);
        setStatus("ready");
      })
      .catch((err) => {
        setPreviewError(err instanceof Error ? err.message : "This invitation link is no longer valid.");
        setStatus("error");
      });
  }, [token]);

  // Same "wait for the saga to resolve" pattern as LoginPage/RegisterPage —
  // covers both the create-account and inline-login forms below, since both
  // dispatch into the same state.auth slice.
  useEffect(() => {
    if (!pendingAction || loading) return;
    if (error) {
      message.error(error);
      setPendingAction(null);
      return;
    }
    if (isAuthenticated && pendingAction === "create") {
      // registerViaInvitation already created the account AND accepted the
      // invitation in one backend transaction — there's nothing left to
      // accept. Go straight to the app instead of falling through to the
      // authenticated branch below, which would show an "Accept Invitation"
      // button that can only fail with "already accepted" if clicked.
      message.success(`You've joined ${preview?.organizationName ?? "your team"}`);
      dispatch(fetchOrganizationRequest());
      router.push("/dashboard");
    }
    // pendingAction === "login": now authenticated, but nothing has been
    // accepted yet — fall through to the normal authenticated render below,
    // which shows the Accept Invitation confirmation.
    setPendingAction(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingAction, loading, isAuthenticated, error]);

  const {
    control: createControl,
    handleSubmit: handleCreateSubmit,
    watch: watchCreate,
    formState: { errors: createErrors },
  } = useForm<CreateAccountFormValues>({
    defaultValues: { name: "", password: "", confirmPassword: "" },
  });
  const createPassword = watchCreate("password");

  const {
    control: loginControl,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormValues>({ defaultValues: { password: "" } });

  const submitCreate = (values: CreateAccountFormValues) => {
    if (!token) return;
    setPendingAction("create");
    dispatch(
      registerViaInvitationRequest({
        token,
        name: values.name,
        password: values.password,
        confirmPassword: values.confirmPassword,
      }),
    );
  };

  const submitLogin = (values: LoginFormValues) => {
    if (!preview) return;
    setPendingAction("login");
    dispatch(loginRequest({ email: preview.email, password: values.password, remember: true }));
  };

  const handleAccept = async () => {
    if (!token || !preview) return;
    setAccepting(true);
    setAcceptError(null);
    try {
      await acceptInvitation(token);
      dispatch(fetchOrganizationRequest());
      message.success(`You've joined ${preview.organizationName}`);
      router.push("/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unable to accept this invitation";
      // acceptInvitation only ever succeeds for the invitation's own email
      // (enforced server-side), so "already accepted" while signed in as
      // that exact email can only mean this account already joined —
      // there's no retry that could ever succeed, so send them in instead
      // of leaving them stuck on a button that will fail forever.
      if (msg.toLowerCase().includes("already been accepted")) {
        dispatch(fetchOrganizationRequest());
        message.info(`You've already joined ${preview.organizationName}`);
        router.push("/dashboard");
        return;
      }
      setAcceptError(msg);
    } finally {
      setAccepting(false);
    }
  };

  if (status === "loading") {
    return (
      <AuthLayout heroTitle="You're invited to Seyora." heroDescription="Loading your invitation…">
        <div className="skeleton" style={{ height: 160 }} />
      </AuthLayout>
    );
  }

  if (status === "error" || !preview) {
    // Already signed in and revisiting a stale link (e.g. one already
    // accepted, or after a refresh) — send them into the app they're
    // already in rather than back to a login screen they don't need.
    return (
      <AuthLayout heroTitle="You're invited to Seyora." heroDescription="Let's get you set up.">
        <h2 className="auth-title">This invitation isn&rsquo;t available</h2>
        <p className="auth-sub">{previewError}</p>
        <button
          type="button"
          className="btn primary"
          style={{ width: "100%", justifyContent: "center", marginTop: 12 }}
          onClick={() => router.push(isAuthenticated ? "/dashboard" : "/login")}
        >
          {isAuthenticated ? "Go to dashboard" : "Go to Seyora"}
        </button>
      </AuthLayout>
    );
  }

  const roleLabel = ORG_ROLE_LABEL[preview.role as keyof typeof ORG_ROLE_LABEL] ?? preview.role;

  // Already signed in — either confirm-and-join (matching email) or flag
  // the mismatch and offer to sign out before continuing.
  if (isAuthenticated && user) {
    const emailMatches = user.email.toLowerCase() === preview.email.toLowerCase();

    return (
      <AuthLayout
        heroTitle="You're invited to Seyora."
        heroDescription={`Join ${preview.organizationName} and start collaborating with your team.`}
      >
        <h2 className="auth-title">You&rsquo;re invited to join {preview.organizationName}</h2>
        <div className="auth-sub">
          {emailMatches
            ? `Your role will be ${roleLabel}.`
            : `This invitation was sent to ${preview.email}, but you're signed in as ${user.email}.`}
        </div>

        {emailMatches ? (
          <>
            <div
              className="card"
              style={{ padding: 12, margin: "16px 0", display: "flex", justifyContent: "space-between" }}
            >
              <span className="tiny muted">Your role</span>
              <strong className="small">{roleLabel}</strong>
            </div>
            {acceptError ? (
              <p className="tiny" style={{ color: "var(--danger)", marginBottom: 8 }}>
                {acceptError}
              </p>
            ) : null}
            <button
              type="button"
              className="btn primary"
              style={{ width: "100%", justifyContent: "center" }}
              disabled={accepting}
              onClick={handleAccept}
            >
              {accepting ? "Joining…" : "Accept Invitation"}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="btn"
              style={{ width: "100%", justifyContent: "center", marginTop: 12 }}
              onClick={() => dispatch(logout())}
            >
              Sign out
            </button>
            <p className="tiny muted" style={{ marginTop: 8 }}>
              You&rsquo;ll be able to create an account or log in as {preview.email} next.
            </p>
          </>
        )}
      </AuthLayout>
    );
  }

  // Not signed in — create-account (default) or inline log-in, both scoped
  // to the invitation's own email (never a client-editable one for accounts
  // that don't exist yet).
  return (
    <AuthLayout
      heroTitle="You're invited to Seyora."
      heroDescription={`Join ${preview.organizationName} and start collaborating with your team.`}
    >
      <h2 className="auth-title">You&rsquo;re invited to join {preview.organizationName}</h2>
      <div className="auth-sub">Your role will be {roleLabel}.</div>

      <div
        className="card"
        style={{ padding: 12, margin: "16px 0", display: "flex", justifyContent: "space-between" }}
      >
        <span className="tiny muted">Email</span>
        <strong className="small">{preview.email}</strong>
      </div>

      {mode === "create" ? (
        <Form layout="vertical" onFinish={handleCreateSubmit(submitCreate)}>
          <Form.Item
            label="Full name"
            validateStatus={createErrors.name ? "error" : ""}
            help={createErrors.name?.message}
          >
            <Controller
              name="name"
              control={createControl}
              rules={{ required: "Full name is required" }}
              render={({ field }) => <Input {...field} placeholder="Jordan Lee" autoComplete="name" />}
            />
          </Form.Item>
          <Form.Item
            label="Password"
            validateStatus={createErrors.password ? "error" : ""}
            help={createErrors.password?.message}
          >
            <Controller
              name="password"
              control={createControl}
              rules={{
                required: "Password is required",
                minLength: { value: 8, message: "At least 8 characters" },
              }}
              render={({ field }) => (
                <Input.Password {...field} placeholder="••••••••" autoComplete="new-password" />
              )}
            />
          </Form.Item>
          <Form.Item
            label="Confirm password"
            validateStatus={createErrors.confirmPassword ? "error" : ""}
            help={createErrors.confirmPassword?.message}
          >
            <Controller
              name="confirmPassword"
              control={createControl}
              rules={{
                required: "Confirm your password",
                validate: (v) => v === createPassword || "Passwords do not match",
              }}
              render={({ field }) => (
                <Input.Password {...field} placeholder="••••••••" autoComplete="new-password" />
              )}
            />
          </Form.Item>
          <button
            type="submit"
            className="btn primary"
            style={{ width: "100%", justifyContent: "center" }}
            disabled={loading}
          >
            {loading ? "Creating account…" : "Create Account & Join"}
          </button>
        </Form>
      ) : (
        <Form layout="vertical" onFinish={handleLoginSubmit(submitLogin)}>
          <Form.Item
            label="Password"
            validateStatus={loginErrors.password ? "error" : ""}
            help={loginErrors.password?.message}
          >
            <Controller
              name="password"
              control={loginControl}
              rules={{ required: "Password is required" }}
              render={({ field }) => (
                <Input.Password {...field} placeholder="••••••••" autoComplete="current-password" />
              )}
            />
          </Form.Item>
          <button
            type="submit"
            className="btn primary"
            style={{ width: "100%", justifyContent: "center" }}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Log in & Join"}
          </button>
        </Form>
      )}

      <div className="auth-foot">
        {mode === "create" ? (
          <>
            Already have a Seyora account?{" "}
            <button type="button" className="link" style={LINK_BUTTON_STYLE} onClick={() => setMode("login")}>
              Log in
            </button>
          </>
        ) : (
          <>
            New to Seyora?{" "}
            <button type="button" className="link" style={LINK_BUTTON_STYLE} onClick={() => setMode("create")}>
              Create an account
            </button>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
