"use client";

import { Input, Modal } from "antd";
import { useState } from "react";
import { useMessage } from "@/lib/hooks/use-message";
import { scrollableModalStyles } from "@/lib/modal-styles";

type Target = "organization" | "account" | null;

export default function DangerZoneTab() {
  const message = useMessage();
  const [target, setTarget] = useState<Target>(null);
  const [confirmValue, setConfirmValue] = useState("");

  const expected = target === "organization" ? "Chola Technology" : "DELETE";
  const canConfirm =
    confirmValue.trim().length > 0 && confirmValue === expected;

  const close = () => {
    setTarget(null);
    setConfirmValue("");
  };

  return (
    <>
      <div className="settings-content-card">
        <h2>Danger Zone</h2>
        <p className="settings-desc">
          Irreversible actions for this account and organization.
        </p>

        <div className="card card-pad danger-zone" style={{ marginBottom: 12 }}>
          <strong>Delete organization</strong>
          <p className="small muted" style={{ margin: "8px 0 14px" }}>
            Permanently remove all projects, tasks, members and integrations.
          </p>
          <button
            type="button"
            className="btn danger"
            onClick={() => setTarget("organization")}
          >
            Delete organization
          </button>
        </div>

        <div className="card card-pad danger-zone">
          <strong>Delete account</strong>
          <p className="small muted" style={{ margin: "8px 0 14px" }}>
            Your personal account and access will be permanently removed.
          </p>
          <button
            type="button"
            className="btn danger"
            onClick={() => setTarget("account")}
          >
            Delete account
          </button>
        </div>
      </div>

      <Modal
        title={
          target === "organization" ? "Delete organization?" : "Delete account?"
        }
        open={target !== null}
        onCancel={close}
        okText="Delete permanently"
        okButtonProps={{ danger: true, disabled: !canConfirm }}
        onOk={() => {
          message.error(`${target} deleted`);
          close();
        }}
        destroyOnHidden
        centered
        styles={scrollableModalStyles}
      >
        <div className="card card-pad danger-zone">
          <strong>This action cannot be undone.</strong>
          <p className="small muted">
            Type <b>{expected}</b> to confirm.
          </p>
          <Input
            value={confirmValue}
            onChange={(e) => setConfirmValue(e.target.value)}
            placeholder="Type confirmation"
          />
        </div>
      </Modal>
    </>
  );
}
