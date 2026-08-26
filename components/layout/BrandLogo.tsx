"use client";

import Image from "next/image";
import { useTheme } from "@/lib/context/theme-context";

export default function BrandLogo() {
  const { theme } = useTheme();
  // dark-logo.png has a solid black background — it blends into the dark
  // sidebar/header surfaces, but shows as a black square on light ones, so
  // light theme falls back to the transparent-background mark instead.
  const src = theme === "dark" ? "/dark-logo.png" : "/logo.svg";

  return (
    <span className="logo">
      <Image src={src} alt="Seyora" fill sizes="42px" style={{ objectFit: "contain" }} />
    </span>
  );
}
