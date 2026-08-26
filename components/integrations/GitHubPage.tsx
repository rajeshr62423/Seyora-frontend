"use client";

import { GitPullRequest } from "lucide-react";
import { users } from "@/lib/data/users";
import { useMessage } from "@/lib/hooks/use-message";

const COMMITS = [
  "feat: add project analytics",
  "fix: mobile navigation",
  "refactor: notification service",
  "test: payment webhook",
];

const PULL_REQUESTS: [string, "In Review" | "In Progress"][] = [
  ["#184 Improve webhook retry", "In Progress"],
  ["#181 Add analytics filters", "In Review"],
  ["#179 Update auth flow", "In Progress"],
];

export default function GitHubPage() {
  const message = useMessage();

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">GitHub integration</h1>
          <div className="page-sub">
            Repository activity, pull requests and deployment signals.
          </div>
        </div>
        <button
          type="button"
          className="btn danger"
          onClick={() => message.error("GitHub connection removed")}
        >
          Disconnect
        </button>
      </div>

      <div className="grid g3">
        <div className="card kpi">
          <span className="kpi-label">Connection</span>
          <div
            className="kpi-value"
            style={{ fontSize: 18, color: "var(--success)" }}
          >
            Connected
          </div>
          <div className="trend">Acme organization</div>
        </div>
        <div className="card kpi">
          <span className="kpi-label">Repository</span>
          <div className="kpi-value" style={{ fontSize: 18 }}>
            Seyora-web
          </div>
          <div className="trend">main branch</div>
        </div>
        <div className="card kpi">
          <span className="kpi-label">Webhook</span>
          <div
            className="kpi-value"
            style={{ fontSize: 18, color: "var(--success)" }}
          >
            Healthy
          </div>
          <div className="trend">Last delivery 2m ago</div>
        </div>
      </div>

      <div className="grid g2" style={{ marginTop: 14 }}>
        <div className="card">
          <div className="panel-head">
            <span className="card-title">Recent commits</span>
          </div>
          {COMMITS.map((c, i) => (
            <div key={c} className="list-row">
              <span className="avatar">{users[i % users.length].initials}</span>
              <div style={{ flex: 1 }}>
                <strong className="small">{c}</strong>
                <div className="tiny muted">
                  a{i}91bc · {i + 1}h ago
                </div>
              </div>
              <span className="badge badge-done">main</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="panel-head">
            <span className="card-title">Pull requests</span>
          </div>
          {PULL_REQUESTS.map(([title, status], i) => (
            <div key={title} className="list-row">
              <div className="project-icon">
                <GitPullRequest size={15} />
              </div>
              <div style={{ flex: 1 }}>
                <strong className="small">{title}</strong>
                <div className="tiny muted">
                  opened by {users[i % users.length].name}
                </div>
              </div>
              <span
                className={`badge ${status === "In Review" ? "badge-review" : "badge-progressing"}`}
              >
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
