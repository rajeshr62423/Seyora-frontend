import type { ReactNode } from "react";
import BrandLogo from "@/components/layout/BrandLogo";

export interface AuthStat {
  value: string;
  label: string;
}

/** Shared step tracker for the onboarding → invite → first-project flow,
 * so all three pages show the same three cards with a consistent order. */
export const ONBOARDING_STEPS: AuthStat[] = [
  { value: "01", label: "Organization" },
  { value: "02", label: "Team" },
  { value: "03", label: "Project" },
];

interface AuthLayoutProps {
  heroTitle: string;
  heroDescription: string;
  stats?: AuthStat[];
  /** 1-indexed. When set alongside `stats`, treats the stat cards as a step
   * tracker (highlighting the current one) and renders a progress bar above
   * the form. */
  currentStep?: number;
  children: ReactNode;
}

export default function AuthLayout({
  heroTitle,
  heroDescription,
  stats,
  currentStep,
  children,
}: AuthLayoutProps) {
  const totalSteps = stats?.length ?? 0;
  const showProgress = !!currentStep && totalSteps > 0;

  return (
    <div className="auth-shell">
      <section className="auth-art">
        <div className="auth-logo">
          <BrandLogo />
          Seyora
        </div>
        <h1>{heroTitle}</h1>
        <p>{heroDescription}</p>
        {stats ? (
          <div className="auth-grid">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`art-card ${currentStep === i + 1 ? "active" : ""}`}
              >
                <strong>{s.value}</strong>
                <span className="tiny muted">{s.label}</span>
              </div>
            ))}
          </div>
        ) : null}
      </section>
      <section className="auth-form-wrap">
        <div className="auth-card">
          <div className="auth-logo">
            <BrandLogo />
            Seyora
          </div>
          {showProgress ? (
            <div
              className="auth-progress"
              role="progressbar"
              aria-valuenow={currentStep}
              aria-valuemin={1}
              aria-valuemax={totalSteps}
              aria-label={`Step ${currentStep} of ${totalSteps}`}
            >
              <div className="auth-progress-track">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <span key={i} className={i < (currentStep ?? 0) ? "filled" : ""} />
                ))}
              </div>
              <span className="auth-progress-label">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
          ) : null}
          {children}
        </div>
      </section>
    </div>
  );
}
