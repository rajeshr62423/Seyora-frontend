"use client";

import { MailCheck } from "lucide-react";
import Link from "next/link";
import { useMessage } from "@/lib/hooks/use-message";
import AuthLayout from "./AuthLayout";

export default function VerifyEmailPage() {
  const message = useMessage();

  return (
    <AuthLayout
      heroTitle="Engineering work, without the busywork."
      heroDescription="Plan projects, ship features, collaborate with your team and connect engineering signals in one focused workspace."
    >
      <h2 className="auth-title">Verify your email</h2>
      <div className="auth-sub">We sent a verification link to your inbox.</div>
      <div className="empty" style={{ padding: "20px 0" }}>
        <div className="empty-icon" style={{ color: "var(--success)" }}>
          <MailCheck size={22} />
        </div>
        <strong>Check your inbox</strong>
        <p className="small muted">We sent a verification link to john@acme.dev.</p>
      </div>
      <button
        type="button"
        className="btn primary"
        style={{ width: "100%", justifyContent: "center" }}
        onClick={() => message.success("Verification email sent")}
      >
        Resend email
      </button>
      <div className="auth-foot">
        Wrong email? <Link href="/register" className="link">Change email</Link>
      </div>
    </AuthLayout>
  );
}
