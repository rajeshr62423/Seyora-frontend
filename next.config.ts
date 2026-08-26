import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    // Default bottom-left position collides with the app's own mobile
    // bottom nav (also anchored bottom-left). Dev-only, no effect on
    // production builds.
    position: "top-right",
  },
};

export default nextConfig;
