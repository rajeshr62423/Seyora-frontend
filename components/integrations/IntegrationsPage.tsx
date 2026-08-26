"use client";

import { Plug } from "lucide-react";
import Link from "next/link";
import { integrations } from "@/lib/data/integrations";
import { useMessage } from "@/lib/hooks/use-message";

export default function IntegrationsPage() {
  const message = useMessage();

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Integrations</h1>
          <div className="page-sub">
            Connect Seyora to the tools your engineering team already uses.
          </div>
        </div>
      </div>
      <div className="grid g3">
        {integrations.map((integration) => (
          <div key={integration.id} className="card card-pad">
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div className="project-icon">
                <Plug size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <strong>{integration.name}</strong>
                <div className="tiny muted">
                  {integration.connected ? "Connected" : "Disconnected"}
                </div>
              </div>
              {integration.connected ? (
                <span className="badge badge-done">Connected</span>
              ) : (
                <span className="badge badge-gray">Available</span>
              )}
            </div>
            <p className="small muted" style={{ lineHeight: 1.6 }}>
              {integration.description}
            </p>
            {integration.href ? (
              <Link
                href={integration.href}
                className="btn"
                style={{ justifyContent: "center" }}
              >
                Configure
              </Link>
            ) : (
              <button
                type="button"
                className={`btn ${integration.connected ? "" : "primary"}`}
                style={{ justifyContent: "center", width: "100%" }}
                onClick={() =>
                  message.success(
                    integration.connected
                      ? "Integration settings opened"
                      : `${integration.name} connected`,
                  )
                }
              >
                {integration.connected ? "Configure" : "Connect"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
