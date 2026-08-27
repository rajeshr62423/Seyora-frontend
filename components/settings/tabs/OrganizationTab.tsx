"use client";

import { Input } from "antd";
import { useEffect, useState } from "react";
import { useMessage } from "@/lib/hooks/use-message";
import { updateOrganizationRequest } from "@/redux/organization/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const ADMIN_ROLES = ["OWNER", "ADMIN"];

export default function OrganizationTab() {
  const dispatch = useAppDispatch();
  const { current, loading, updating, updateError, members } = useAppSelector((state) => state.organization);
  const authUser = useAppSelector((state) => state.auth.user);
  const message = useMessage();
  const [attempted, setAttempted] = useState(false);

  const myRole = members.find((m) => m.userId === authUser?.id)?.role;
  const isAdmin = myRole ? ADMIN_ROLES.includes(myRole) : false;

  useEffect(() => {
    if (!attempted || updating) return;
    if (updateError) {
      message.error(updateError);
    } else {
      message.success("Organization settings saved");
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttempted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempted, updating, updateError]);

  if (loading && !current) {
    return (
      <div className="settings-content-card">
        <h2>Organization</h2>
        <p className="settings-desc">Workspace-wide defaults and identity.</p>
        <div className="skeleton" style={{ height: 90 }} />
      </div>
    );
  }
  if (!current) return null;

  return (
    <OrganizationForm
      organizationId={current.id}
      initialName={current.name}
      initialTimezone={current.timezone}
      initialProjectPrefix={current.projectPrefix}
      slug={current.slug}
      updating={updating}
      isAdmin={isAdmin}
      onSave={(input) => {
        setAttempted(true);
        dispatch(updateOrganizationRequest(input));
      }}
    />
  );
}

function OrganizationForm({
  initialName,
  initialTimezone,
  initialProjectPrefix,
  slug,
  updating,
  isAdmin,
  onSave,
}: {
  organizationId: string;
  initialName: string;
  initialTimezone: string;
  initialProjectPrefix: string;
  slug: string;
  updating: boolean;
  isAdmin: boolean;
  onSave: (input: { name: string; timezone: string; projectPrefix: string }) => void;
}) {
  const [name, setName] = useState(initialName);
  const [timezone, setTimezone] = useState(initialTimezone);
  const [projectPrefix, setProjectPrefix] = useState(initialProjectPrefix);

  return (
    <div className="settings-content-card">
      <h2>Organization</h2>
      <p className="settings-desc">Workspace-wide defaults and identity.</p>
      <div className="grid g2">
        <div>
          <label className="tiny muted" style={{ display: "block", marginBottom: 6 }}>
            Organization name
          </label>
          <Input value={name} onChange={(e) => setName(e.target.value)} disabled={!isAdmin} />
        </div>
        <div>
          <label className="tiny muted" style={{ display: "block", marginBottom: 6 }}>
            Organization slug
          </label>
          <Input value={slug} disabled title="Derived from the organization name at creation time" />
        </div>
        <div>
          <label className="tiny muted" style={{ display: "block", marginBottom: 6 }}>
            Timezone
          </label>
          <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} disabled={!isAdmin} />
        </div>
        <div>
          <label className="tiny muted" style={{ display: "block", marginBottom: 6 }}>
            Default project prefix
          </label>
          <Input value={projectPrefix} onChange={(e) => setProjectPrefix(e.target.value.toUpperCase())} disabled={!isAdmin} />
        </div>
      </div>
      {!isAdmin ? (
        <p className="tiny muted" style={{ marginTop: 12 }}>
          Only owners and admins can change organization settings.
        </p>
      ) : null}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
        <button
          type="button"
          className="btn primary"
          disabled={!isAdmin || updating}
          onClick={() => onSave({ name, timezone, projectPrefix })}
        >
          {updating ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
