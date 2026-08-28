"use client";

import { Input, Select } from "antd";
import { MoreHorizontal, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Avatar from "@/components/common/Avatar";
import { useMessage } from "@/lib/hooks/use-message";
import { createInvitationsRequest, updateMemberRoleRequest } from "@/redux/organization/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { OrgRole } from "@/types/organization";

const ADMIN_ROLES: OrgRole[] = ["OWNER", "ADMIN"];
const ROLE_OPTIONS: { value: OrgRole; label: string }[] = [
  { value: "OWNER", label: "Owner" },
  { value: "ADMIN", label: "Admin" },
  { value: "MANAGER", label: "Manager" },
  { value: "MEMBER", label: "Member" },
  { value: "VIEWER", label: "Viewer" },
];

export default function MembersTab() {
  const dispatch = useAppDispatch();
  const { members, memberRoleError, invitesSending, invitesError } = useAppSelector((state) => state.organization);
  const projects = useAppSelector((state) => state.projects.list);
  const authUser = useAppSelector((state) => state.auth.user);
  const message = useMessage();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<OrgRole>("MEMBER");
  const [inviteAttempted, setInviteAttempted] = useState(false);

  const myRole = members.find((m) => m.userId === authUser?.id)?.role;
  const isAdmin = myRole ? ADMIN_ROLES.includes(myRole) : false;

  useEffect(() => {
    if (memberRoleError) message.error(memberRoleError);
  }, [memberRoleError, message]);

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

  return (
    <div className="settings-content-card">
      <h2>Members &amp; roles</h2>
      <p className="settings-desc">Invite members and manage workspace permissions.</p>
      {isAdmin ? (
        <div style={{ marginBottom: 14 }}>
          <div className="actions">
            <button type="button" className="btn primary" onClick={() => setInviteOpen((v) => !v)}>
              <Plus size={15} /> Invite member
            </button>
          </div>
          {inviteOpen ? (
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <Input
                placeholder="teammate@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                style={{ maxWidth: 280 }}
              />
              <Select<OrgRole>
                value={inviteRole}
                onChange={setInviteRole}
                style={{ width: 130 }}
                options={ROLE_OPTIONS.filter((r) => r.value !== "OWNER")}
              />
              <button type="button" className="btn primary" onClick={sendInvite} disabled={invitesSending}>
                {invitesSending ? "Sending…" : "Send"}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
      <div className="table-wrap">
        <table className="table" style={{ minWidth: 600 }}>
          <thead>
            <tr>
              <th>Member</th>
              <th>Role</th>
              <th>Status</th>
              <th>Projects</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>
                  <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <Avatar url={member.user.avatarUrl} initials={member.user.initials} />
                    {member.user.name}
                  </span>
                </td>
                <td>
                  <Select<OrgRole>
                    value={member.role}
                    style={{ width: 130 }}
                    options={ROLE_OPTIONS}
                    disabled={!isAdmin}
                    onChange={(value) => dispatch(updateMemberRoleRequest({ userId: member.userId, role: value }))}
                  />
                </td>
                <td>
                  <span className="badge badge-done">Active</span>
                </td>
                <td>{projects.filter((p) => p.team.some((m) => m.id === member.userId)).length}</td>
                <td>
                  <button
                    type="button"
                    className="icon-btn"
                    style={{ width: 28, height: 28 }}
                    onClick={() => message.info("More actions opened")}
                  >
                    <MoreHorizontal size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
