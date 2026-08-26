"use client";

import { Input } from "antd";
import { useMessage } from "@/lib/hooks/use-message";

export default function OrganizationTab() {
  const message = useMessage();

  return (
    <div className="settings-content-card">
      <h2>Organization</h2>
      <p className="settings-desc">Workspace-wide defaults and identity.</p>
      <div className="grid g2">
        <div>
          <label
            className="tiny muted"
            style={{ display: "block", marginBottom: 6 }}
          >
            Organization name
          </label>
          <Input defaultValue="Chola Technology" />
        </div>
        <div>
          <label
            className="tiny muted"
            style={{ display: "block", marginBottom: 6 }}
          >
            Organization ID
          </label>
          <Input defaultValue="org_acme_7d91" disabled />
        </div>
        <div>
          <label
            className="tiny muted"
            style={{ display: "block", marginBottom: 6 }}
          >
            Timezone
          </label>
          <Input defaultValue="Asia/Kolkata" />
        </div>
        <div>
          <label
            className="tiny muted"
            style={{ display: "block", marginBottom: 6 }}
          >
            Default project prefix
          </label>
          <Input defaultValue="DEV" />
        </div>
      </div>
      <div
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}
      >
        <button
          type="button"
          className="btn primary"
          onClick={() => message.success("Organization settings saved")}
        >
          Save changes
        </button>
      </div>
    </div>
  );
}
