"use client";

import { GitBranch, Plug } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { comingSoonIntegrations } from "@/lib/data/integrations";
import { useConfirm } from "@/lib/hooks/use-confirm";
import { useMessage } from "@/lib/hooks/use-message";
import {
  connectIntegrationRequest,
  disconnectIntegrationRequest,
  fetchIntegrationsRequest,
} from "@/redux/integrations/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function IntegrationsPage() {
  const dispatch = useAppDispatch();
  const message = useMessage();
  const confirm = useConfirm();
  const { list, loading, connectingProviders, disconnectingProviders, connectError, disconnectError } =
    useAppSelector((state) => state.integrations);

  useEffect(() => {
    dispatch(fetchIntegrationsRequest());
  }, [dispatch]);

  useEffect(() => {
    if (connectError) message.error(connectError);
  }, [connectError, message]);
  useEffect(() => {
    if (disconnectError) message.error(disconnectError);
  }, [disconnectError, message]);

  const github = list.find((i) => i.provider === "github");
  const githubConnected = github?.status === "connected";
  const githubBusy = connectingProviders.includes("github") || disconnectingProviders.includes("github");

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Integrations</h1>
          <div className="page-sub">Connect Seyora to the tools your engineering team already uses.</div>
        </div>
      </div>
      <div className="grid g3">
        <div className="card card-pad">
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div className="project-icon">
              <GitBranch size={16} />
            </div>
            <div style={{ flex: 1 }}>
              <strong>GitHub</strong>
              <div className="tiny muted">
                {loading ? "Checking…" : githubConnected ? "Connected" : "Disconnected"}
              </div>
            </div>
            {githubConnected ? (
              <span className="badge badge-done">Connected</span>
            ) : (
              <span className="badge badge-gray">Available</span>
            )}
          </div>
          <p className="small muted" style={{ lineHeight: 1.6 }}>
            Source control, pull requests and deployments
          </p>
          {githubConnected ? (
            <div style={{ display: "flex", gap: 8 }}>
              <Link href="/github" className="btn" style={{ justifyContent: "center", flex: 1 }}>
                Configure
              </Link>
              <button
                type="button"
                className="btn danger"
                disabled={githubBusy}
                onClick={() =>
                  confirm({
                    title: "Disconnect GitHub?",
                    content: "Repository activity, pull requests and deployment signals will stop syncing.",
                    okText: "Disconnect",
                    onConfirm: () => dispatch(disconnectIntegrationRequest("github")),
                  })
                }
              >
                {disconnectingProviders.includes("github") ? "Disconnecting…" : "Disconnect"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn primary"
              style={{ justifyContent: "center", width: "100%" }}
              disabled={githubBusy}
              onClick={() => dispatch(connectIntegrationRequest("github"))}
            >
              {connectingProviders.includes("github") ? "Connecting…" : "Connect"}
            </button>
          )}
        </div>

        {comingSoonIntegrations.map((integration) => (
          <div key={integration.id} className="card card-pad" style={{ opacity: 0.7 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div className="project-icon">
                <Plug size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <strong>{integration.name}</strong>
                <div className="tiny muted">Coming soon</div>
              </div>
              <span className="badge badge-gray">Coming soon</span>
            </div>
            <p className="small muted" style={{ lineHeight: 1.6 }}>
              {integration.description}
            </p>
            <button type="button" className="btn" style={{ justifyContent: "center", width: "100%" }} disabled>
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
