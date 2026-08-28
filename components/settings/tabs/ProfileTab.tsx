"use client";

import { Input, Select, Upload } from "antd";
import { Camera } from "lucide-react";
import { useEffect, useState } from "react";
import Avatar from "@/components/common/Avatar";
import { useAppRouter } from "@/lib/hooks/use-app-router";
import { useConfirm } from "@/lib/hooks/use-confirm";
import { useMessage } from "@/lib/hooks/use-message";
import { ORG_ROLE_LABEL } from "@/lib/status";
import { TIMEZONE_OPTIONS } from "@/lib/timezones";
import { logout, removeAvatarRequest, uploadAvatarRequest } from "@/redux/auth/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;

export default function ProfileTab() {
  const dispatch = useAppDispatch();
  const router = useAppRouter();
  const message = useMessage();
  const confirm = useConfirm();
  const { user, avatarUploading, avatarError } = useAppSelector((state) => state.auth);
  const [pendingAvatarAction, setPendingAvatarAction] = useState<"upload" | "remove" | null>(null);
  // The workspace role (Owner/Admin/Manager/Member/Viewer) — NOT
  // user.role, which is an unrelated free-text job-title field on the
  // User model (defaults to the literal string "Member" for every
  // account and is never actually set anywhere in the app), which is why
  // this tab previously showed "Member" for every user regardless of
  // their real role. state.organization.myRole is the same org-scoped
  // role Members & Roles already displays correctly.
  const myRole = useAppSelector((state) => state.organization.myRole);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  // No per-user timezone exists on the backend yet (still a display-only
  // field, same as before) — defaults to the browser's own detected
  // timezone instead of a hardcoded one.
  const [timezone, setTimezone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Once the auth saga resolves, bring the editable fields in sync with the
  // loaded user. Adjusting state during render (guarded by the last seen
  // user id) avoids an extra effect-driven render pass.
  const [syncedUserId, setSyncedUserId] = useState<string | null>(null);
  if (user && user.id !== syncedUserId) {
    setSyncedUserId(user.id);
    setName(user.name);
    setEmail(user.email);
  }

  useEffect(() => {
    if (!pendingAvatarAction || avatarUploading) return;
    if (avatarError) {
      message.error(avatarError);
    } else {
      message.success(pendingAvatarAction === "upload" ? "Profile photo updated" : "Profile photo removed");
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPendingAvatarAction(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingAvatarAction, avatarUploading, avatarError]);

  const handleAvatarUpload = (file: File) => {
    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      message.error("Only JPEG, PNG, WEBP, or GIF images are allowed");
      return false;
    }
    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      message.error("Image must be smaller than 5MB");
      return false;
    }
    setPendingAvatarAction("upload");
    dispatch(uploadAvatarRequest(file));
    return false;
  };

  const handleRemoveAvatar = () => {
    confirm({
      title: "Remove photo?",
      content: "Your profile picture will be removed and replaced with your initials.",
      okText: "Remove",
      onConfirm: () => {
        setPendingAvatarAction("remove");
        dispatch(removeAvatarRequest());
      },
    });
  };

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
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          <Avatar
            url={user?.avatarUrl}
            initials={user?.initials ?? "JA"}
            style={{ width: 60, height: 60, fontSize: 19, flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{user?.name ?? "—"}</div>
            <div className="small muted" style={{ marginTop: 2 }}>
              {user?.email ?? ""}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10 }}>
              <Upload
                accept={ALLOWED_AVATAR_TYPES.join(",")}
                showUploadList={false}
                disabled={avatarUploading}
                beforeUpload={handleAvatarUpload}
              >
                <button
                  type="button"
                  className="btn ghost"
                  disabled={avatarUploading}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                >
                  <Camera size={14} />
                  {avatarUploading && pendingAvatarAction === "upload" ? "Uploading…" : "Change photo"}
                </button>
              </Upload>
              {user?.avatarUrl ? (
                <button
                  type="button"
                  disabled={avatarUploading}
                  onClick={handleRemoveAvatar}
                  className="tiny"
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    color: "var(--danger)",
                    fontWeight: 600,
                    cursor: avatarUploading ? "default" : "pointer",
                    opacity: avatarUploading ? 0.6 : 1,
                  }}
                >
                  {avatarUploading && pendingAvatarAction === "remove" ? "Removing…" : "Remove photo"}
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div style={{ borderBottom: "1px solid var(--border)", marginBottom: 24 }} />

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
            <Input value={myRole ? ORG_ROLE_LABEL[myRole] : "—"} disabled />
          </div>
          <div>
            <label
              className="tiny muted"
              style={{ display: "block", marginBottom: 6 }}
            >
              Timezone
            </label>
            <Select
              value={timezone}
              onChange={setTimezone}
              showSearch
              optionFilterProp="label"
              placeholder="Search timezones…"
              style={{ width: "100%" }}
              options={TIMEZONE_OPTIONS}
            />
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
            onClick={() =>
              confirm({
                title: "Sign out?",
                content: "You'll need to sign in again to access your workspace.",
                okText: "Sign out",
                onConfirm: () => {
                  dispatch(logout());
                  router.push("/login");
                },
              })
            }
          >
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}
