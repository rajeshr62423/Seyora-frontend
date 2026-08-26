"use client";

import { Select } from "antd";
import { MoreHorizontal, Plus } from "lucide-react";
import { useProjects } from "@/lib/context/projects-context";
import { useMessage } from "@/lib/hooks/use-message";
import { useAppSelector } from "@/redux/hooks";

const ROLES = ["Owner", "Admin", "Manager", "Member"];

export default function MembersTab() {
  const users = useAppSelector((state) => state.users.list);
  const { projects } = useProjects();
  const message = useMessage();

  return (
    <div className="settings-content-card">
      <h2>Members &amp; roles</h2>
      <p className="settings-desc">Invite members and manage workspace permissions.</p>
      <div className="actions" style={{ marginBottom: 14 }}>
        <button type="button" className="btn primary" onClick={() => message.info("Invite flow is not part of this demo.")}>
          <Plus size={15} /> Invite member
        </button>
      </div>
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
            {users.map((u, i) => (
              <tr key={u.id}>
                <td>
                  <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span className="avatar">{u.initials}</span>
                    {u.name}
                  </span>
                </td>
                <td>
                  <Select
                    defaultValue={ROLES[Math.min(i, ROLES.length - 1)]}
                    style={{ width: 130 }}
                    options={ROLES.map((r) => ({ value: r, label: r }))}
                    onChange={(value) => message.success(`${u.name} is now ${value}`)}
                  />
                </td>
                <td>
                  <span className="badge badge-done">Active</span>
                </td>
                <td>{projects.filter((p) => p.team.some((m) => m.id === u.id)).length}</td>
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
