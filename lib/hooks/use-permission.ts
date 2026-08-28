import { useAppSelector } from "@/redux/hooks";

// UI-visibility check only (e.g. hiding a nav item/button the user can't
// act on) — the backend's PermissionsGuard is the actual authorization,
// this is never trusted as a security boundary. Reads from
// state.organization.myPermissions, populated by the same
// fetchOrganizationRequest that loads the current org, no separate fetch.
export function usePermission(permission: string): boolean {
  return useAppSelector((state) => state.organization.myPermissions.includes(permission));
}
