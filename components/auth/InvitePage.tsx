"use client";

import { Input, Select } from "antd";
import { Controller, useForm } from "react-hook-form";
import { useAppRouter } from "@/lib/hooks/use-app-router";
import { useMessage } from "@/lib/hooks/use-message";
import AuthLayout, { ONBOARDING_STEPS } from "./AuthLayout";

interface InviteRow {
  email: string;
  role: "Admin" | "Member";
}

interface InviteFormValues {
  invites: InviteRow[];
}

export default function InvitePage() {
  const router = useAppRouter();
  const message = useMessage();
  const { control, handleSubmit } = useForm<InviteFormValues>({
    defaultValues: {
      invites: [
        { email: "sarah@acme.dev", role: "Admin" },
        { email: "mike@acme.dev", role: "Member" },
        { email: "alex@acme.dev", role: "Member" },
      ],
    },
  });

  const sendInvites = () => {
    message.success("3 invitations are on their way");
    router.push("/first-project");
  };

  return (
    <AuthLayout
      heroTitle="Bring the team in."
      heroDescription="Invite teammates now or skip and do it later from Settings."
      stats={ONBOARDING_STEPS}
      currentStep={2}
    >
      <h2 className="auth-title">Invite team members</h2>
      <div className="auth-sub">Collaborate from day one.</div>
      <form onSubmit={handleSubmit(sendInvites)}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 9 }}>
            <Controller
              name={`invites.${i}.email` as const}
              control={control}
              render={({ field }) => <Input {...field} style={{ flex: 1 }} />}
            />
            <Controller
              name={`invites.${i}.role` as const}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  style={{ width: 120 }}
                  options={[
                    { value: "Admin", label: "Admin" },
                    { value: "Member", label: "Member" },
                  ]}
                />
              )}
            />
          </div>
        ))}
        <button type="submit" className="btn primary" style={{ width: "100%", justifyContent: "center", marginTop: 9 }}>
          Send invites
        </button>
        <button
          type="button"
          className="btn ghost"
          style={{ width: "100%", justifyContent: "center", marginTop: 6 }}
          onClick={() => router.push("/first-project")}
        >
          Skip for now
        </button>
      </form>
    </AuthLayout>
  );
}
