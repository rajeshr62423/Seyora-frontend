"use client";

import { Input, Select } from "antd";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useAppRouter } from "@/lib/hooks/use-app-router";
import { useMessage } from "@/lib/hooks/use-message";
import { createInvitationsRequest } from "@/redux/organization/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import AuthLayout, { ONBOARDING_STEPS } from "./AuthLayout";

interface InviteRow {
  email: string;
  role: "ADMIN" | "MEMBER";
}

interface InviteFormValues {
  invites: InviteRow[];
}

export default function InvitePage() {
  const router = useAppRouter();
  const dispatch = useAppDispatch();
  const message = useMessage();
  const { invitesSending, invitesError } = useAppSelector((state) => state.organization);
  const [attempted, setAttempted] = useState(false);
  const { control, handleSubmit } = useForm<InviteFormValues>({
    defaultValues: {
      invites: [
        { email: "sarah@acme.dev", role: "ADMIN" },
        { email: "mike@acme.dev", role: "MEMBER" },
        { email: "alex@acme.dev", role: "MEMBER" },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "invites" });

  // Invites aren't a hard dependency for onboarding — only the organization
  // is. A failed send still lets the user continue, just with a toast.
  useEffect(() => {
    if (!attempted || invitesSending) return;
    if (invitesError) {
      message.error(invitesError);
    } else {
      message.success(`${fields.length} invitation${fields.length === 1 ? "" : "s"} sent`);
    }
    router.push("/first-project");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttempted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempted, invitesSending, invitesError]);

  const sendInvites = (values: InviteFormValues) => {
    const invites = values.invites.filter((row) => row.email.trim().length > 0);
    if (invites.length === 0) {
      router.push("/first-project");
      return;
    }
    setAttempted(true);
    dispatch(createInvitationsRequest(invites));
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
        {fields.map((field, i) => (
          <div key={field.id} style={{ display: "flex", gap: 8, marginBottom: 9 }}>
            <Controller
              name={`invites.${i}.email` as const}
              control={control}
              render={({ field }) => <Input {...field} style={{ flex: 1 }} placeholder="teammate@company.com" />}
            />
            <Controller
              name={`invites.${i}.role` as const}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  style={{ width: 120 }}
                  options={[
                    { value: "ADMIN", label: "Admin" },
                    { value: "MEMBER", label: "Member" },
                  ]}
                />
              )}
            />
            <button
              type="button"
              className="icon-btn"
              style={{ width: 38, height: 38 }}
              aria-label="Remove invite"
              onClick={() => remove(i)}
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn"
          style={{ marginBottom: 9 }}
          onClick={() => append({ email: "", role: "MEMBER" })}
        >
          <Plus size={14} /> Add another
        </button>
        <button
          type="submit"
          className="btn primary"
          style={{ width: "100%", justifyContent: "center", marginTop: 9 }}
          disabled={invitesSending}
        >
          {invitesSending ? "Sending…" : "Send invites"}
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
