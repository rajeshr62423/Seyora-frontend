"use client";

import { Input, Modal, Select } from "antd";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useMessage } from "@/lib/hooks/use-message";
import { scrollableModalStyles } from "@/lib/modal-styles";

export default function WebhooksTab() {
  const message = useMessage();
  const [modalOpen, setModalOpen] = useState(false);
  const [endpoint, setEndpoint] = useState("");

  return (
    <div className="settings-content-card">
      <h2>Webhooks</h2>
      <p className="settings-desc">
        Deliver Seyora events to external endpoints.
      </p>
      <div className="actions" style={{ marginBottom: 14 }}>
        <button
          type="button"
          className="btn primary"
          onClick={() => setModalOpen(true)}
        >
          <Plus size={15} /> Create webhook
        </button>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Endpoint</th>
              <th>Events</th>
              <th>Status</th>
              <th>Last delivery</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>https://api.acme.dev/Seyora</td>
              <td>task.*, project.*</td>
              <td>
                <span className="badge badge-done">Healthy</span>
              </td>
              <td>2m ago</td>
              <td>
                <button
                  type="button"
                  className="btn"
                  onClick={() => message.success("Test delivery sent")}
                >
                  Test
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Modal
        title="Create webhook"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        okText="Create webhook"
        onOk={() => {
          setModalOpen(false);
          setEndpoint("");
          message.success("Endpoint is ready for delivery");
        }}
        destroyOnHidden
        centered
        styles={scrollableModalStyles}
      >
        <div className="grid g2">
          <div className="field full" style={{ gridColumn: "1 / -1" }}>
            <label
              className="tiny muted"
              style={{ display: "block", marginBottom: 6 }}
            >
              Endpoint URL
            </label>
            <Input
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="https://api.example.com/webhooks"
            />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label
              className="tiny muted"
              style={{ display: "block", marginBottom: 6 }}
            >
              Events
            </label>
            <Select
              defaultValue="all"
              style={{ width: "100%" }}
              options={[
                { value: "all", label: "All events" },
                { value: "tasks", label: "Tasks only" },
                { value: "projects", label: "Projects only" },
              ]}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
