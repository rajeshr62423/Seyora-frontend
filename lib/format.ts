export function formatDisplayDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatDisplayDateFull(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function isDueThisMonth(iso: string, reference: Date = new Date()): boolean {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return false;
  return date.getFullYear() === reference.getFullYear() && date.getMonth() === reference.getMonth();
}

// `iso` is a full ISO datetime (not the bare YYYY-MM-DD the other
// formatters here expect) — for activity/notification feeds, which need
// minute/hour precision, not just a date.
export function formatRelativeTime(iso: string, reference: Date = new Date()): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  const diffMs = reference.getTime() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const diffDays = Math.round(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  // Beyond ~a week, fall back to a real date — formatDisplayDate expects a
  // bare YYYY-MM-DD, so slice the full timestamp down first (passing it a
  // full ISO datetime directly would silently produce "Invalid Date").
  return formatDisplayDate(iso.slice(0, 10));
}

// Full ISO datetime -> "Aug 28, 2026 at 12:30 PM". For contexts that need
// the exact moment (task activity timeline), not a relative time or a
// bare date.
export function formatExactDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${formatDisplayDateFull(iso.slice(0, 10))} at ${time}`;
}

// Matches seyora-backend's src/common/utils/initials.ts algorithm — the
// backend only computes this for auth responses (AuthUser), so anything
// coming from /users, /organizations/me/members, project owners/members
// needs it derived client-side to keep the User.initials contract intact.
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
