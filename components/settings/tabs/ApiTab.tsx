"use client";

import { Input, Modal } from "antd";
import { Copy, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useConfirm } from "@/lib/hooks/use-confirm";
import { useMessage } from "@/lib/hooks/use-message";
import { formatDisplayDateFull } from "@/lib/format";
import { scrollableModalStyles } from "@/lib/modal-styles";
import {
  closeCreateApiKeyModal,
  createApiKeyRequest,
  fetchApiKeysRequest,
  openCreateApiKeyModal,
  revokeApiKeyRequest,
} from "@/redux/apiKeys/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const ADMIN_ROLES = ["OWNER", "ADMIN"];

export default function ApiTab() {
  const dispatch = useAppDispatch();
  const message = useMessage();
  const confirm = useConfirm();
  const { list, loading, revokingIds, isCreateModalOpen, creating, createError, createdKey } = useAppSelector(
    (state) => state.apiKeys,
  );
  const authUser = useAppSelector((state) => state.auth.user);
  const members = useAppSelector((state) => state.organization.members);
  const [keyName, setKeyName] = useState("");

  const myRole = members.find((m) => m.userId === authUser?.id)?.role;
  const isAdmin = myRole ? ADMIN_ROLES.includes(myRole) : false;

  useEffect(() => {
    dispatch(fetchApiKeysRequest());
  }, [dispatch]);

  useEffect(() => {
    if (createError) message.error(createError);
  }, [createError, message]);

  const handleCreate = () => {
    if (!keyName.trim()) return;
    dispatch(createApiKeyRequest(keyName.trim()));
  };

  const handleCopy = (key: string) => {
    navigator.clipboard?.writeText(key);
    message.success("Copied to clipboard");
  };

  const handleClose = () => {
    dispatch(closeCreateApiKeyModal());
    setKeyName("");
  };

  return (
    <div className="settings-content-card">
      <h2>API keys</h2>
      <p className="settings-desc">Create and revoke keys used by your automation and integrations.</p>
      {isAdmin ? (
        <div className="actions" style={{ marginBottom: 14 }}>
          <button type="button" className="btn primary" onClick={() => dispatch(openCreateApiKeyModal())}>
            <Plus size={15} /> Create API key
          </button>
        </div>
      ) : (
        <p className="tiny muted" style={{ marginBottom: 14 }}>
          Only owners and admins can manage API keys.
        </p>
      )}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Created</th>
              <th>Last used</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {loading && list.length === 0 ? (
              <tr>
                <td colSpan={5}>Loading…</td>
              </tr>
            ) : list.length === 0 ? (
              <tr>
                <td colSpan={5}>No API keys yet.</td>
              </tr>
            ) : (
              list.map((k) => (
                <tr key={k.id}>
                  <td>
                    <strong>{k.name}</strong>
                    <div className="tiny muted">{k.preview}</div>
                  </td>
                  <td>{formatDisplayDateFull(k.createdAt.slice(0, 10))}</td>
                  <td>{k.lastUsedAt ? formatDisplayDateFull(k.lastUsedAt.slice(0, 10)) : "Never"}</td>
                  <td>
                    {k.revokedAt ? (
                      <span className="badge badge-gray">Revoked</span>
                    ) : (
                      <span className="badge badge-done">Active</span>
                    )}
                  </td>
                  <td>
                    {!k.revokedAt && isAdmin ? (
                      <button
                        type="button"
                        className="btn danger"
                        disabled={revokingIds.includes(k.id)}
                        onClick={() =>
                          confirm({
                            title: `Revoke "${k.name}"?`,
                            content: "Any automation or integration using this key will immediately lose access.",
                            okText: "Revoke",
                            onConfirm: () => dispatch(revokeApiKeyRequest(k.id)),
                          })
                        }
                      >
                        {revokingIds.includes(k.id) ? "Revoking…" : "Revoke"}
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        title="Create API key"
        open={isCreateModalOpen}
        onCancel={handleClose}
        okText={createdKey ? "Done" : "Create key"}
        onOk={createdKey ? handleClose : handleCreate}
        confirmLoading={creating}
        cancelButtonProps={createdKey ? { style: { display: "none" } } : undefined}
        destroyOnHidden
        centered
        styles={scrollableModalStyles}
      >
        {createdKey ? (
          <div>
            <div className="help" style={{ marginBottom: 10 }}>
              Copy this key now — you won&rsquo;t be able to see it again.
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Input readOnly value={createdKey.key} style={{ fontFamily: "monospace" }} />
              <button type="button" className="icon-btn" aria-label="Copy key" onClick={() => handleCopy(createdKey.key)}>
                <Copy size={14} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <label className="tiny muted" style={{ display: "block", marginBottom: 6 }}>
              Key name
            </label>
            <Input
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder="e.g. CI deployment key"
              onPressEnter={handleCreate}
            />
            <div className="help" style={{ marginTop: 10 }}>
              The secret will only be shown once.
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
