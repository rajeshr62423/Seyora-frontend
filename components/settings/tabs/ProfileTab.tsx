"use client";

import { Input } from "antd";
import { useState } from "react";
import { useMessage } from "@/lib/hooks/use-message";
import { logout } from "@/redux/auth/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function ProfileTab() {
  const dispatch = useAppDispatch();
  const message = useMessage();
  const { user, loading, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  // Once the auth saga resolves, bring the editable fields in sync with the
  // loaded user. Adjusting state during render (guarded by the last seen
  // user id) avoids an extra effect-driven render pass.
  const [syncedUserId, setSyncedUserId] = useState<string | null>(null);
  if (user && user.id !== syncedUserId) {
    setSyncedUserId(user.id);
    setName(user.name);
    setEmail(user.email);
  }

  return (
    <>
      <div className="settings-content-card">
        <h2>Profile</h2>
        <p className="settings-desc">
          Update your personal profile and workspace identity.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <span
            className="avatar"
            style={{ width: 48, height: 48, fontSize: 15 }}
          >
            {user?.initials ?? "JA"}
          </span>
          <div className="small muted">
            {loading
              ? "Signing in…"
              : isAuthenticated
                ? "Signed in"
                : "Signed out"}
          </div>
        </div>

        <div className="grid g2">
          <div>
            <label
              className="tiny muted"
              style={{ display: "block", marginBottom: 6 }}
            >
              Full name
            </label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label
              className="tiny muted"
              style={{ display: "block", marginBottom: 6 }}
            >
              Email
            </label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </div>
          <div>
            <label
              className="tiny muted"
              style={{ display: "block", marginBottom: 6 }}
            >
              Role
            </label>
            <Input value={user?.role ?? "Senior Developer"} disabled />
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
        </div>

        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}
        >
          <button
            type="button"
            className="btn primary"
            onClick={() => message.success("Profile saved")}
          >
            Save changes
          </button>
        </div>
      </div>

      <div className="card danger-zone" style={{ marginTop: 14 }}>
        <div className="card-pad">
          <strong style={{ color: "var(--danger)" }}>Sign out</strong>
          <p className="small muted" style={{ margin: "8px 0 14px" }}>
            End your current Seyora session on this device.
          </p>
          <button
            type="button"
            className="btn danger"
            onClick={() => dispatch(logout())}
          >
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}
