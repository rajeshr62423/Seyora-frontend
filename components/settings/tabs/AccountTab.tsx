"use client";

import { Input } from "antd";
import { FolderGit2 } from "lucide-react";
import { useMessage } from "@/lib/hooks/use-message";

export default function AccountTab() {
  const message = useMessage();

  return (
    <div className="settings-content-card">
      <h2>Account</h2>
      <p className="settings-desc">Control your username, email and connected accounts.</p>
      <div className="grid g2">
        <div>
          <label className="tiny muted" style={{ display: "block", marginBottom: 6 }}>
            Username
          </label>
          <Input defaultValue="johnanderson" />
        </div>
        <div>
          <label className="tiny muted" style={{ display: "block", marginBottom: 6 }}>
            Email
          </label>
          <Input defaultValue="john@acme.dev" type="email" />
        </div>
      </div>
      <hr style={{ border: 0, borderTop: "1px solid var(--border)", margin: "20px 0" }} />
      <strong style={{ fontSize: 13 }}>Connected accounts</strong>
      <div className="list-row" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className="project-icon">
          <FolderGit2 size={16} />
        </div>
        <span style={{ flex: 1 }}>GitHub</span>
        <span className="badge badge-done">Connected</span>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 28 }}>
        <button type="button" className="btn primary" onClick={() => message.success("Account settings saved")}>
          Save changes
        </button>
      </div>
    </div>
  );
}
