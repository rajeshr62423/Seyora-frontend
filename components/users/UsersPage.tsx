"use client";

import { useMemo, useState } from "react";
import { Search, UserPlus, Users as UsersIcon } from "lucide-react";
import { useProjects } from "@/lib/context/projects-context";
import { useMessage } from "@/lib/hooks/use-message";
import { useAppSelector } from "@/redux/hooks";
import UserCard from "./UserCard";

export default function UsersPage() {
  const { list: users, loading } = useAppSelector((state) => state.users);
  const { projects } = useProjects();
  const message = useMessage();
  const [query, setQuery] = useState("");

  const filtered = users.filter((u) => `${u.name} ${u.role}`.toLowerCase().includes(query.trim().toLowerCase()));

  const avgWorkload = useMemo(() => {
    if (!users.length) return 0;
    const total = users.reduce((sum, u) => {
      const memberProjects = projects.filter((p) => p.team.some((m) => m.id === u.id));
      const avg = memberProjects.length
        ? memberProjects.reduce((s, p) => s + p.progress, 0) / memberProjects.length
        : 0;
      return sum + avg;
    }, 0);
    return Math.round(total / users.length);
  }, [users, projects]);

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
        <button
          type="button"
          className="btn primary"
          onClick={() => message.info("Invite flow is not part of this demo.")}
        >
          <UserPlus size={15} />
          Invite member
        </button>
      </div>

      <div className="team-summary">
        <div className="card team-hero">
          <div className="hero-icon">
            <UsersIcon size={22} />
          </div>
          <div>
            <div className="tiny muted">Engineering workspace</div>
            <strong style={{ fontSize: 16 }}>{users.length || 5} people shipping together</strong>
            <div className="tiny muted" style={{ marginTop: 5 }}>
              {Math.max(users.length - 1, 0)} active today · 1 away
            </div>
          </div>
        </div>
        <div className="card team-stat">
          <span>Active today</span>
          <strong>{Math.max(users.length - 1, 0)}</strong>
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
          <input placeholder="Search by name or role..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {loading && !users.length ? (
        <div className="card empty">
          <strong>Loading team…</strong>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card empty">
          <strong>No team members found</strong>
          <div className="small muted" style={{ marginTop: 6 }}>
            Try a different name or role.
          </div>
        </div>
      ) : (
        <div className="team-grid">
          {filtered.map((user) => (
            <UserCard key={user.id} user={user} projects={projects} />
          ))}
        </div>
      )}
    </div>
  );
}
