import type { CSSProperties } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

interface AvatarProps {
  /** Relative "/uploads/..." URL (User.avatarUrl / Organization.logoUrl), or null/undefined for no image. */
  url?: string | null;
  /** Fallback text shown when there's no image — a person's initials, or an org's first letter. */
  initials: string;
  className?: string;
  style?: CSSProperties;
  title?: string;
}

// Every avatar/org-badge in the app goes through this: an uploaded image
// when one exists, otherwise the same initials badge every one of these
// spots already rendered before uploads existed. `className` REPLACES
// (doesn't append to) the default "avatar" class — the org-dot badge in
// Sidebar.tsx has its own complete circle styling ("org-dot"), and
// blending both classes would fight over conflicting width/height rules.
export default function Avatar({ url, initials, className = "avatar", style, title }: AvatarProps) {
  if (url) {
    return (
      <img
        src={`${API_BASE_URL}${url}`}
        alt={initials}
        title={title}
        className={className}
        style={{ objectFit: "cover", ...style }}
      />
    );
  }

  return (
    <span className={className} style={style} title={title}>
      {initials}
    </span>
  );
}
