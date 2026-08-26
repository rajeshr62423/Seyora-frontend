"use client";

import { useState } from "react";

const ROWS = [
  "Email notifications",
  "Task assignments",
  "Mentions",
  "Comments",
  "Project updates",
  "Security alerts",
  "Weekly summary",
];

export default function NotificationsTab() {
  const [toggles, setToggles] = useState<boolean[]>(ROWS.map((_, i) => i === 5 || i < 4));

  return (
    <div className="settings-content-card">
      <h2>Notification preferences</h2>
      <p className="settings-desc">Choose which events should notify you.</p>
      {ROWS.map((label, i) => (
        <div key={label} className="settings-row">
          <div>
            <div className="settings-row-title">{label}</div>
            <div className="settings-row-desc">Receive {label.toLowerCase()} in your workspace.</div>
          </div>
          <button
            type="button"
            className={`switch ${toggles[i] ? "on" : ""}`}
            onClick={() => setToggles((prev) => prev.map((v, idx) => (idx === i ? !v : v)))}
          >
            <span />
          </button>
        </div>
      ))}
    </div>
  );
}
