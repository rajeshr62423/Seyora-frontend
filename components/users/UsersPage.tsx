"use client";

import { Input, Pagination, Select } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Search, UserPlus, Users as UsersIcon } from "lucide-react";
import { usePermission } from "@/lib/hooks/use-permission";
import { useMessage } from "@/lib/hooks/use-message";
import { createInvitationsRequest, fetchMemberDirectoryRequest } from "@/redux/organization/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { OrgRole } from "@/types/organization";
import UserCard from "./UserCard";

const DEFAULT_PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;
const ROLE_OPTIONS: { value: OrgRole; label: string }[] = [
  { value: "ADMIN", label: "Admin" },
  { value: "MANAGER", label: "Manager" },
  { value: "MEMBER", label: "Member" },
  { value: "VIEWER", label: "Viewer" },
];

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const message = useMessage();
  const canInvite = usePermission("MEMBER_INVITE");
  const {
    members,
    directoryItems,
    directoryPage,
    directoryPageSize,
    directoryTotal,
    directoryLoading,
    directoryError,
    invitesSending,
    invitesError,
  } = useAppSelector((state) => state.organization);
  const projects = useAppSelector((state) => state.projects.list);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<OrgRole>("MEMBER");
  const [inviteAttempted, setInviteAttempted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Any change to the search term or page size invalidates whatever page
  // number the user was on — jump back to page 1 rather than risk landing
  // on a now out-of-range page. Adjusted during render (guarded by the last
  // seen values) rather than in an effect, to avoid an extra render pass.
  const [lastFilters, setLastFilters] = useState({ search: debouncedSearch, pageSize });
  if (lastFilters.search !== debouncedSearch || lastFilters.pageSize !== pageSize) {
    setLastFilters({ search: debouncedSearch, pageSize });
    setPage(1);
  }

  useEffect(() => {
    dispatch(fetchMemberDirectoryRequest({ page, pageSize, search: debouncedSearch || undefined }));
  }, [dispatch, page, pageSize, debouncedSearch]);

  useEffect(() => {
    if (directoryError) message.error(directoryError);
  }, [directoryError, message]);

  // Same "attempted" pattern as Settings > Members & Roles' inline invite
  // form — this page's own toolbar button duplicates that flow rather than
  // linking there, so admins can invite without leaving the Team page.
  useEffect(() => {
    if (!inviteAttempted || invitesSending) return;
    if (invitesError) {
      message.error(invitesError);
    } else {
      message.success(`Invitation sent to ${inviteEmail}`);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInviteEmail("");
      setInviteOpen(false);
    }
    setInviteAttempted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inviteAttempted, invitesSending, invitesError]);

  const sendInvite = () => {
    if (!inviteEmail.trim()) return;
    setInviteAttempted(true);
    dispatch(createInvitationsRequest([{ email: inviteEmail.trim(), role: inviteRole }]));
  };

  const teamMembers = directoryItems;

  // Team-wide summary stats stay computed from the full (unpaginated) org
  // member cache — state.organization.members — not the current directory
  // page, so they show true org-wide numbers instead of fluctuating as the
  // admin pages through the directory.
  const avgWorkload = useMemo(() => {
    if (!members.length) return 0;
    const total = members.reduce((sum, m) => {
      const memberProjects = projects.filter((p) => p.team.some((t) => t.id === m.user.id));
      const avg = memberProjects.length
        ? memberProjects.reduce((s, p) => s + p.progress, 0) / memberProjects.length
        : 0;
      return sum + avg;
    }, 0);
    return Math.round(total / members.length);
  }, [members, projects]);

  const openAssignments = useMemo(
    () => projects.reduce((sum, p) => sum + Math.max(0, p.taskCount - Math.round((p.progress / 100) * p.taskCount)), 0),
    [projects]
  );

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">People / Engineering</div>
          <h1 className="page-title">Team</h1>
          <div className="page-sub">Keep ownership, workload and availability visible across your engineering organization.</div>
        </div>
        {canInvite ? (
          <button type="button" className="btn primary" onClick={() => setInviteOpen((v) => !v)}>
            <UserPlus size={15} />
            Invite member
          </button>
        ) : null}
      </div>

      {inviteOpen ? (
        <div className="card card-pad" style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <Input
            placeholder="teammate@company.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            style={{ maxWidth: 280 }}
          />
          <Select<OrgRole> value={inviteRole} onChange={setInviteRole} style={{ width: 130 }} options={ROLE_OPTIONS} />
          <button type="button" className="btn primary" onClick={sendInvite} disabled={invitesSending}>
            {invitesSending ? "Sending…" : "Send"}
          </button>
        </div>
      ) : null}

      <div className="team-summary">
        <div className="card team-hero">
          <div className="hero-icon">
            <UsersIcon size={22} />
          </div>
          <div>
            <div className="tiny muted">Engineering workspace</div>
            <strong style={{ fontSize: 16 }}>{members.length || 5} people shipping together</strong>
            <div className="tiny muted" style={{ marginTop: 5 }}>
              {Math.max(members.length - 1, 0)} active today · 1 away
            </div>
          </div>
        </div>
        <div className="card team-stat">
          <span>Active today</span>
          <strong>{Math.max(members.length - 1, 0)}</strong>
          <div className="trend up">+4 this week</div>
        </div>
        <div className="card team-stat">
          <span>Avg. workload</span>
          <strong>{avgWorkload}%</strong>
          <div className="trend up">Healthy</div>
        </div>
        <div className="card team-stat">
          <span>Open assignments</span>
          <strong>{openAssignments}</strong>
          <div className="trend down">12 overdue</div>
        </div>
      </div>

      <div className="toolbar">
        <div className="search">
          <Search size={16} strokeWidth={1.8} />
          <input
            placeholder="Search by name or role..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      {directoryLoading ? (
        <div className="card empty">
          <strong>Loading team…</strong>
        </div>
      ) : teamMembers.length === 0 ? (
        <div className="card empty">
          <strong>No team members found</strong>
          <div className="small muted" style={{ marginTop: 6 }}>
            Try a different name or role.
          </div>
        </div>
      ) : (
        <>
          <div className="team-grid">
            {teamMembers.map((member) => (
              <UserCard key={member.user.id} user={member.user} role={member.role} projects={projects} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
            <Pagination
              current={directoryPage}
              pageSize={directoryPageSize}
              total={directoryTotal}
              showSizeChanger
              pageSizeOptions={["10", "20", "50"]}
              hideOnSinglePage
              onChange={(newPage, newPageSize) => {
                setPage(newPage);
                setPageSize(newPageSize);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
