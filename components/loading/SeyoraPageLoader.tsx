"use client";

import Image from "next/image";
import { useNavigationLoader } from "@/lib/context/navigation-loader-context";
import { useTheme } from "@/lib/context/theme-context";

export default function SeyoraPageLoader() {
  const { phase, progress } = useNavigationLoader();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="seyora-loader" data-phase={phase} role="status" aria-live="polite" aria-label="Loading workspace" aria-hidden={phase === "idle"}>
      <div className="seyora-loader-bg" aria-hidden="true">
        <span className="seyora-loader-ring seyora-loader-ring-outer" />
        <span className="seyora-loader-ring seyora-loader-ring-inner" />
        <span className="seyora-loader-node seyora-loader-node-1" />
        <span className="seyora-loader-node seyora-loader-node-2" />
        <span className="seyora-loader-node seyora-loader-node-3" />
        <span className="seyora-loader-node seyora-loader-node-4" />
        <span className="seyora-loader-dashes seyora-loader-dashes-1" />
        <span className="seyora-loader-dashes seyora-loader-dashes-2" />
      </div>

      <div className="seyora-loader-content">
        <div className="seyora-loader-logo">
          {isDark ? (
            <Image src="/dark-logo.png" alt="Seyora" width={1536} height={1024} priority sizes="260px" />
          ) : (
            <Image src="/light-logo.png" alt="Seyora" width={1264} height={843} priority sizes="260px" />
          )}
        </div>
        <div className="seyora-loader-tagline">Plan. Build. Collaborate. Deliver.</div>

        <div className="seyora-loader-status">
          <span className="seyora-loader-spinner" />
          <span>Loading workspace&hellip;</span>
        </div>

        <div className="seyora-loader-progress">
          <div className="seyora-loader-progress-track">
            <div className="seyora-loader-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="seyora-loader-progress-pct">{progress}%</div>
        </div>
      </div>
    </div>
  );
}
