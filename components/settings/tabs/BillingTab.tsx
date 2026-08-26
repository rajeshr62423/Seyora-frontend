"use client";

import { useMessage } from "@/lib/hooks/use-message";

export default function BillingTab() {
  const message = useMessage();

  return (
    <div className="settings-content-card">
      <h2>Billing</h2>
      <p className="settings-desc">Manage your subscription and payment details.</p>
      <div className="card card-pad" style={{ background: "var(--card2)", marginBottom: 14 }}>
        <div className="tiny muted">Current plan</div>
        <div style={{ fontSize: 22, fontWeight: 760, margin: "5px 0" }}>Professional</div>
        <div className="small muted">$24 / user / month · billed monthly</div>
        <button
          type="button"
          className="btn primary"
          style={{ marginTop: 13 }}
          onClick={() => message.info("Plan management is not part of this demo.")}
        >
          Manage plan
        </button>
      </div>
      <div className="grid g3">
        {[
          ["Users", "32 / 50"],
          ["Projects", "12 / 100"],
          ["Storage", "18.4 GB / 100 GB"],
        ].map(([label, value]) => (
          <div key={label}>
            <div className="tiny muted">{label}</div>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
