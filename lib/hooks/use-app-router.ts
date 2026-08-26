"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useNavigationLoader } from "@/lib/context/navigation-loader-context";

/**
 * Drop-in replacement for next/navigation's useRouter(). The global click
 * listener in NavigationLoaderProvider already covers <Link>/<a> navigation;
 * this covers the other case — programmatic router.push()/replace() calls
 * (form submits, "skip" buttons, etc.) — by starting the same loader first.
 */
export function useAppRouter() {
  const router = useRouter();
  const { start } = useNavigationLoader();

  return useMemo(
    () => ({
      ...router,
      push: (...args: Parameters<typeof router.push>) => {
        start();
        router.push(...args);
      },
      replace: (...args: Parameters<typeof router.replace>) => {
        start();
        router.replace(...args);
      },
    }),
    [router, start]
  );
}
