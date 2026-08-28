export const FETCH_ORGANIZATION_REQUEST = "organization/FETCH_ORGANIZATION_REQUEST";
export const FETCH_ORGANIZATION_SUCCESS = "organization/FETCH_ORGANIZATION_SUCCESS";
export const FETCH_ORGANIZATION_FAILURE = "organization/FETCH_ORGANIZATION_FAILURE";
// Distinct from FAILURE: the authenticated user simply hasn't created/joined
// an organization yet (abandoned onboarding, etc.) — not an error to show,
// a signal to redirect to /onboarding. See AppShell.tsx's org guard.
export const FETCH_ORGANIZATION_NOT_FOUND = "organization/FETCH_ORGANIZATION_NOT_FOUND";

export const CREATE_ORGANIZATION_REQUEST = "organization/CREATE_ORGANIZATION_REQUEST";
export const CREATE_ORGANIZATION_SUCCESS = "organization/CREATE_ORGANIZATION_SUCCESS";
export const CREATE_ORGANIZATION_FAILURE = "organization/CREATE_ORGANIZATION_FAILURE";

export const UPDATE_ORGANIZATION_REQUEST = "organization/UPDATE_ORGANIZATION_REQUEST";
export const UPDATE_ORGANIZATION_SUCCESS = "organization/UPDATE_ORGANIZATION_SUCCESS";
export const UPDATE_ORGANIZATION_FAILURE = "organization/UPDATE_ORGANIZATION_FAILURE";

export const FETCH_MEMBERS_REQUEST = "organization/FETCH_MEMBERS_REQUEST";
export const FETCH_MEMBERS_SUCCESS = "organization/FETCH_MEMBERS_SUCCESS";
export const FETCH_MEMBERS_FAILURE = "organization/FETCH_MEMBERS_FAILURE";

// Separate from FETCH_MEMBERS_*: that one bootstraps the full org member
// list for role checks/picker dropdowns; this one drives the paginated
// Team-page directory grid. Same backend endpoint, different query params.
export const FETCH_MEMBER_DIRECTORY_REQUEST = "organization/FETCH_MEMBER_DIRECTORY_REQUEST";
export const FETCH_MEMBER_DIRECTORY_SUCCESS = "organization/FETCH_MEMBER_DIRECTORY_SUCCESS";
export const FETCH_MEMBER_DIRECTORY_FAILURE = "organization/FETCH_MEMBER_DIRECTORY_FAILURE";

export const UPDATE_MEMBER_ROLE_REQUEST = "organization/UPDATE_MEMBER_ROLE_REQUEST";
export const UPDATE_MEMBER_ROLE_SUCCESS = "organization/UPDATE_MEMBER_ROLE_SUCCESS";
export const UPDATE_MEMBER_ROLE_FAILURE = "organization/UPDATE_MEMBER_ROLE_FAILURE";

export const CREATE_INVITATIONS_REQUEST = "organization/CREATE_INVITATIONS_REQUEST";
export const CREATE_INVITATIONS_SUCCESS = "organization/CREATE_INVITATIONS_SUCCESS";
export const CREATE_INVITATIONS_FAILURE = "organization/CREATE_INVITATIONS_FAILURE";

export const UPLOAD_LOGO_REQUEST = "organization/UPLOAD_LOGO_REQUEST";
export const UPLOAD_LOGO_SUCCESS = "organization/UPLOAD_LOGO_SUCCESS";
export const UPLOAD_LOGO_FAILURE = "organization/UPLOAD_LOGO_FAILURE";

export const REMOVE_LOGO_REQUEST = "organization/REMOVE_LOGO_REQUEST";
export const REMOVE_LOGO_SUCCESS = "organization/REMOVE_LOGO_SUCCESS";
export const REMOVE_LOGO_FAILURE = "organization/REMOVE_LOGO_FAILURE";
