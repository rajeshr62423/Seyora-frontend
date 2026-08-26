"use client";

import Image from "next/image";
import { useTheme } from "@/lib/context/theme-context";

export default function BrandLogo() {
  const { theme } = useTheme();
  const src = theme === "dark" ? "/dark-logo.png" : "/light-logo.png";

  return (
    <span className="logo">
      <Image src={src} alt="Seyora" fill sizes="42px" style={{ objectFit: "contain" }} priority />
    </span>
  );
}
