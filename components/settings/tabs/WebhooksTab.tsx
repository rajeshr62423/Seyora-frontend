"use client";

import { Input, Modal, Select } from "antd";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useConfirm } from "@/lib/hooks/use-confirm";
import { useMessage } from "@/lib/hooks/use-message";
import { formatRelativeTime } from "@/lib/format";
import { scrollableModalStyles } from "@/lib/modal-styles";
import {
  closeCreateWebhookModal,
  createWebhookRequest,
  deleteWebhookRequest,
  fetchWebhooksRequest,
  openCreateWebhookModal,
  testWebhookRequest,
} from "@/redux/webhooks/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const ADMIN_ROLES = ["OWNER", "ADMIN"];

const EVENT_OPTIONS = [
  { value: "task.*", label: "All task events" },
  { value: "project.*", label: "All project events" },
];

export default function WebhooksTab() {
  const dispatch = useAppDispatch();
  const message = useMessage();
  const confirm = useConfirm();
  const { list, loading, deletingIds, testingIds, testResults, isCreateModalOpen, creating, createError } =
    useAppSelector((state) => state.webhooks);
  const authUser = useAppSelector((state) => state.auth.user);
  const members = useAppSelector((state) => state.organization.members);
  const [url, setUrl] = useState("");
  const [events, setEvents] = useState<string[]>(["task.*", "project.*"]);

  const myRole = members.find((m) => m.userId === authUser?.id)?.role;
  const isAdmin = myRole ? ADMIN_ROLES.includes(myRole) : false;

  useEffect(() => {
    dispatch(fetchWebhooksRequest());
  }, [dispatch]);

  useEffect(() => {
    if (createError) message.error(createError);
  }, [createError, message]);

  const handleClose = () => {
    dispatch(closeCreateWebhookModal());
    setUrl("");
    setEvents(["task.*", "project.*"]);
  };

  const handleCreate = () => {
    if (!url.trim() || events.length === 0) return;
    dispatch(createWebhookRequest({ url: url.trim(), events }));
  };

  const handleTest = (id: string) => {
    dispatch(testWebhookRequest(id));
  };

  return (
    <div className="settings-content-card">
      <h2>Webhooks</h2>
      <p className="settings-desc">Deliver Seyora events to external endpoints.</p>
      {isAdmin ? (
        <div className="actions" style={{ marginBottom: 14 }}>
          <button type="button" className="btn primary" onClick={() => dispatch(openCreateWebhookModal())}>
            <Plus size={15} /> Create webhook
          </button>
        </div>
      ) : (
        <p className="tiny muted" style={{ marginBottom: 14 }}>
          Only owners and admins can manage webhooks.
        </p>
      )}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Endpoint</th>
              <th>Events</th>
              <th>Last delivery</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {loading && list.length === 0 ? (
              <tr>
                <td colSpan={4}>Loading…</td>
              </tr>
            ) : list.length === 0 ? (
              <tr>
                <td colSpan={4}>No webhooks yet.</td>
              </tr>
            ) : (
              list.map((w) => {
                const result = testResults[w.id];
                return (
                  <tr key={w.id}>
                    <td>{w.url}</td>
                    <td>{w.events.join(", ")}</td>
                    <td>
                      {w.lastDeliveryAt ? formatRelativeTime(w.lastDeliveryAt) : "Never"}
                      {result ? (
                        <div className={`tiny ${result.success ? "" : "muted"}`} style={{ color: result.success ? "var(--success)" : "var(--danger)" }}>
                          {result.success ? `Delivered (${result.statusCode})` : `Failed${result.error ? `: ${result.error}` : ""}`}
                        </div>
                      ) : null}
                    </td>
                    <td style={{ display: "flex", gap: 8 }}>
                      {isAdmin ? (
                        <>
                          <button
                            type="button"
                            className="btn"
                            disabled={testingIds.includes(w.id)}
                            onClick={() => handleTest(w.id)}
                          >
                            {testingIds.includes(w.id) ? "Testing…" : "Test"}
                          </button>
                          <button
                            type="button"
                            className="btn danger"
                            disabled={deletingIds.includes(w.id)}
                            onClick={() =>
                              confirm({
                                title: "Delete this webhook?",
                                content: `Seyora will stop sending events to ${w.url}.`,
                                okText: "Delete",
                                onConfirm: () => dispatch(deleteWebhookRequest(w.id)),
                              })
                            }
                          >
                            {deletingIds.includes(w.id) ? "Deleting…" : "Delete"}
                          </button>
                        </>
                      ) : null}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Modal
        title="Create webhook"
        open={isCreateModalOpen}
        onCancel={handleClose}
        okText="Create webhook"
        onOk={handleCreate}
        confirmLoading={creating}
        destroyOnHidden
        centered
        styles={scrollableModalStyles}
      >
        <div className="grid g2">
          <div className="field full" style={{ gridColumn: "1 / -1" }}>
            <label className="tiny muted" style={{ display: "block", marginBottom: 6 }}>
              Endpoint URL
            </label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://api.example.com/webhooks" />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label className="tiny muted" style={{ display: "block", marginBottom: 6 }}>
              Events
            </label>
            <Select
              mode="multiple"
              value={events}
              onChange={setEvents}
              style={{ width: "100%" }}
              options={EVENT_OPTIONS}
              placeholder="Select at least one event"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
