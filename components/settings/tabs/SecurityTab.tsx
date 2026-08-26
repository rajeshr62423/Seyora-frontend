"use client";

import { Input } from "antd";
import { useState } from "react";
import { useMessage } from "@/lib/hooks/use-message";

const SESSIONS = ["Chrome · Windows", "Safari · iPhone", "Chrome · MacBook"];

export default function SecurityTab() {
  const message = useMessage();
  const [twoFactor, setTwoFactor] = useState(true);

  return (
    <div className="settings-content-card">
      <h2>Security</h2>
      <p className="settings-desc">Protect your Seyora account.</p>
      <div className="grid g2">
        <div>
          <label
            className="tiny muted"
            style={{ display: "block", marginBottom: 6 }}
          >
            Current password
          </label>
          <Input.Password placeholder="Current password" />
        </div>
        <div>
          <label
            className="tiny muted"
            style={{ display: "block", marginBottom: 6 }}
          >
            New password
          </label>
          <Input.Password placeholder="New password" />
        </div>
      </div>
      <button
        type="button"
        className="btn primary"
        style={{ marginTop: 14 }}
        onClick={() => message.success("Your password was changed")}
      >
        Change password
      </button>

      <hr
        style={{
          border: 0,
          borderTop: "1px solid var(--border)",
          margin: "22px 0",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <strong>Two-factor authentication</strong>
          <div className="tiny muted">
            Add an extra layer of account security.
          </div>
        </div>
        <button
          type="button"
          className={`switch ${twoFactor ? "on" : ""}`}
          onClick={() => setTwoFactor((v) => !v)}
        >
          <span />
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <strong>Active sessions</strong>
        {SESSIONS.map((s, i) => (
          <div
            key={s}
            className="list-row"
            style={{ paddingLeft: 0, paddingRight: 0 }}
          >
            <span style={{ flex: 1 }}>
              {s}
              <div className="tiny muted">
                {i === 0 ? "Current session" : `Last active ${i + 1}h ago`}
              </div>
            </span>
            <button
              type="button"
              className="btn"
              onClick={() => message.success(`Revoked ${s}`)}
            >
              Revoke
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
