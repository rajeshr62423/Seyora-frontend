"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type NavigationLoaderPhase = "loading" | "exiting" | "idle";

interface NavigationLoaderContextValue {
  phase: NavigationLoaderPhase;
  progress: number;
  /** Begin (or extend) a navigation loading sequence. Safe to call multiple
   * times in flight — a navigation already in progress is left alone. */
  start: () => void;
}

const NavigationLoaderContext = createContext<NavigationLoaderContextValue | null>(null);

// Progress climbs through these checkpoints and then holds at the last one
// until the destination route has actually rendered (pathname changes) —
// it never fakes 100% before that.
const PROGRESS_STEPS: { at: number; delay: number }[] = [
  { at: 35, delay: 150 },
  { at: 60, delay: 300 },
  { at: 80, delay: 450 },
];
const COMPLETE_HOLD_MS = 150;
const EXIT_DURATION_MS = 350;
// If a navigation never resolves (broken route, hung request), force the
// loader closed instead of blocking the app forever.
const SAFETY_TIMEOUT_MS = 6000;

function isModifiedClick(e: MouseEvent) {
  return e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
}

function isSameLocation(url: URL) {
  return url.pathname === window.location.pathname && url.search === window.location.search;
}

export function NavigationLoaderProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [phase, setPhase] = useState<NavigationLoaderPhase>("loading");
  const [progress, setProgress] = useState(15);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isFirstPathnameRun = useRef(true);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const complete = useCallback(() => {
    if (phaseRef.current === "idle") return;
    clearTimers();
    setProgress(100);
    timers.current.push(
      setTimeout(() => {
        setPhase("exiting");
        timers.current.push(
          setTimeout(() => {
            setPhase("idle");
          }, EXIT_DURATION_MS)
        );
      }, COMPLETE_HOLD_MS)
    );
  }, [clearTimers]);

  const start = useCallback(() => {
    if (phaseRef.current === "loading") return; // already mid-navigation
    clearTimers();
    setPhase("loading");
    setProgress(15);
    for (const step of PROGRESS_STEPS) {
      timers.current.push(setTimeout(() => setProgress(step.at), step.delay));
    }
    timers.current.push(setTimeout(complete, SAFETY_TIMEOUT_MS));
  }, [clearTimers, complete]);

  // The initial app load reuses this same machinery: the loader starts
  // already visible (see useState above) and this settles it after a
  // short, deliberate window rather than waiting on a real navigation.
  useEffect(() => {
    timers.current.push(setTimeout(() => setProgress(80), 250));
    timers.current.push(setTimeout(complete, 650));
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pathname changing means the destination route has rendered — that's
  // the real "navigation finished" signal, not a timer guess.
  useEffect(() => {
    if (isFirstPathnameRun.current) {
      isFirstPathnameRun.current = false;
      return;
    }
    if (phaseRef.current === "loading") complete();
  }, [pathname, complete]);

  // Global, capture-phase click listener: detects intent to navigate via
  // any <Link>/<a> in the app (sidebar, topbar, project cards, etc.)
  // without needing every call site to opt in individually.
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.defaultPrevented || isModifiedClick(e)) return;
      const anchor = (e.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      const rel = anchor.getAttribute("rel") ?? "";
      if (rel.includes("external")) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (isSameLocation(url)) return; // same page, or hash-only anchor

      start();
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [start]);

  useEffect(() => clearTimers, [clearTimers]);

  const value = useMemo(() => ({ phase, progress, start }), [phase, progress, start]);

  return (
    <NavigationLoaderContext.Provider value={value}>{children}</NavigationLoaderContext.Provider>
  );
}

export function useNavigationLoader() {
  const ctx = useContext(NavigationLoaderContext);
  if (!ctx) throw new Error("useNavigationLoader must be used within a NavigationLoaderProvider");
  return ctx;
}
