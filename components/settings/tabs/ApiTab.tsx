"use client";

import { Input, Modal } from "antd";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useMessage } from "@/lib/hooks/use-message";
import { scrollableModalStyles } from "@/lib/modal-styles";

const KEYS = [
  { name: "CI deployment", created: "Aug 12, 2026", lastUsed: "2 min ago" },
  { name: "Local development", created: "Aug 9, 2026", lastUsed: "3 days ago" },
  { name: "Analytics worker", created: "Aug 6, 2026", lastUsed: "3 days ago" },
];

export default function ApiTab() {
  const message = useMessage();
  const [modalOpen, setModalOpen] = useState(false);
  const [keyName, setKeyName] = useState("");

  return (
    <div className="settings-content-card">
      <h2>API keys</h2>
      <p className="settings-desc">Create and revoke keys used by your automation and integrations.</p>
      <div className="actions" style={{ marginBottom: 14 }}>
        <button type="button" className="btn primary" onClick={() => setModalOpen(true)}>
          <Plus size={15} /> Create API key
        </button>
      </div>
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
            {KEYS.map((k) => (
              <tr key={k.name}>
                <td>
                  <strong>{k.name}</strong>
                  <div className="tiny muted">df_live_••••••••</div>
                </td>
                <td>{k.created}</td>
                <td>{k.lastUsed}</td>
                <td>
                  <span className="badge badge-done">Active</span>
                </td>
                <td>
                  <button type="button" className="btn danger" onClick={() => message.error(`${k.name} key revoked`)}>
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        title="Create API key"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        okText="Create key"
        onOk={() => {
          setModalOpen(false);
          setKeyName("");
          message.success("Copy your secret now");
        }}
        destroyOnHidden
        centered
        styles={scrollableModalStyles}
      >
        <label className="tiny muted" style={{ display: "block", marginBottom: 6 }}>
          Key name
        </label>
        <Input value={keyName} onChange={(e) => setKeyName(e.target.value)} placeholder="e.g. CI deployment key" />
        <div className="help" style={{ marginTop: 10 }}>
          The secret will only be shown once.
        </div>
      </Modal>
    </div>
  );
}
