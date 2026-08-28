// Fallback for environments without Intl.supportedValuesOf (older browsers) —
// covers the values already referenced elsewhere in this app (org default
// "UTC", profile placeholder "Asia/Kolkata") plus other common zones.
const FALLBACK_TIMEZONES = [
  "UTC",
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Australia/Sydney",
  "Pacific/Auckland",
];

function listTimezones(): string[] {
  if (typeof Intl.supportedValuesOf === "function") {
    try {
      return Intl.supportedValuesOf("timeZone");
    } catch {
      return FALLBACK_TIMEZONES;
    }
  }
  return FALLBACK_TIMEZONES;
}

// value === label — IANA timezone names (e.g. "Asia/Kolkata") are already
// the canonical, human-readable identifier used throughout this app
// (org.timezone, the profile placeholder), so no separate display format.
export const TIMEZONE_OPTIONS: { value: string; label: string }[] = listTimezones().map((tz) => ({
  value: tz,
  label: tz.replace(/_/g, " "),
}));
