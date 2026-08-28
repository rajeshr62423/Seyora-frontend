"use client";

import { Input, Select, Upload } from "antd";
import { useEffect, useState } from "react";
import Avatar from "@/components/common/Avatar";
import { useMessage } from "@/lib/hooks/use-message";
import { useConfirm } from "@/lib/hooks/use-confirm";
import { TIMEZONE_OPTIONS } from "@/lib/timezones";
import { removeLogoRequest, updateOrganizationRequest, uploadLogoRequest } from "@/redux/organization/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const ADMIN_ROLES = ["OWNER", "ADMIN"];
const ALLOWED_LOGO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_LOGO_SIZE_BYTES = 5 * 1024 * 1024;

export default function OrganizationTab() {
  const dispatch = useAppDispatch();
  const { current, loading, updating, updateError, members, logoUploading, logoError } = useAppSelector(
    (state) => state.organization,
  );
  const authUser = useAppSelector((state) => state.auth.user);
  const message = useMessage();
  const confirm = useConfirm();
  const [attempted, setAttempted] = useState(false);
  const [pendingLogoAction, setPendingLogoAction] = useState<"upload" | "remove" | null>(null);

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

  useEffect(() => {
    if (!pendingLogoAction || logoUploading) return;
    if (logoError) {
      message.error(logoError);
    } else {
      message.success(pendingLogoAction === "upload" ? "Organization logo updated" : "Organization logo removed");
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPendingLogoAction(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingLogoAction, logoUploading, logoError]);

  const handleLogoUpload = (file: File) => {
    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      message.error("Only JPEG, PNG, WEBP, or GIF images are allowed");
      return false;
    }
    if (file.size > MAX_LOGO_SIZE_BYTES) {
      message.error("Image must be smaller than 5MB");
      return false;
    }
    setPendingLogoAction("upload");
    dispatch(uploadLogoRequest(file));
    return false;
  };

  const handleRemoveLogo = () => {
    confirm({
      title: "Remove logo?",
      content: "The organization logo will be removed and replaced with its initial.",
      okText: "Remove",
      onConfirm: () => {
        setPendingLogoAction("remove");
        dispatch(removeLogoRequest());
      },
    });
  };

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
      logoUrl={current.logoUrl}
      updating={updating}
      isAdmin={isAdmin}
      logoUploading={logoUploading}
      pendingLogoAction={pendingLogoAction}
      onLogoUpload={handleLogoUpload}
      onLogoRemove={handleRemoveLogo}
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
  logoUrl,
  updating,
  isAdmin,
  logoUploading,
  pendingLogoAction,
  onLogoUpload,
  onLogoRemove,
  onSave,
}: {
  organizationId: string;
  initialName: string;
  initialTimezone: string;
  initialProjectPrefix: string;
  slug: string;
  logoUrl: string | null;
  updating: boolean;
  isAdmin: boolean;
  logoUploading: boolean;
  pendingLogoAction: "upload" | "remove" | null;
  onLogoUpload: (file: File) => boolean;
  onLogoRemove: () => void;
  onSave: (input: { name: string; timezone: string; projectPrefix: string }) => void;
}) {
  const [name, setName] = useState(initialName);
  const [timezone, setTimezone] = useState(initialTimezone);
  const [projectPrefix, setProjectPrefix] = useState(initialProjectPrefix);

  return (
    <div className="settings-content-card">
      <h2>Organization</h2>
      <p className="settings-desc">Workspace-wide defaults and identity.</p>

      {isAdmin ? (
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
          <Avatar url={logoUrl} initials={name?.[0]?.toUpperCase() ?? "S"} style={{ width: 48, height: 48, fontSize: 15 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <Upload
              accept={ALLOWED_LOGO_TYPES.join(",")}
              showUploadList={false}
              disabled={logoUploading}
              beforeUpload={onLogoUpload}
            >
              <button type="button" className="btn ghost" disabled={logoUploading}>
                {logoUploading && pendingLogoAction === "upload" ? "Uploading…" : "Upload logo"}
              </button>
            </Upload>
            {logoUrl ? (
              <button type="button" className="btn ghost" disabled={logoUploading} onClick={onLogoRemove}>
                Remove logo
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

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
          <Select
            value={timezone}
            onChange={setTimezone}
            disabled={!isAdmin}
            showSearch
            optionFilterProp="label"
            placeholder="Search timezones…"
            style={{ width: "100%" }}
            options={TIMEZONE_OPTIONS}
          />
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
