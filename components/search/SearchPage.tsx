"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import Avatar from "@/components/common/Avatar";
import ProjectCard from "@/components/projects/ProjectCard";
import { ORG_ROLE_LABEL } from "@/lib/status";

export default function SearchPage() {
  const projects = useAppSelector((state) => state.projects.list);
  const members = useAppSelector((state) => state.organization.members);
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const matchedProjects = q
    ? projects.filter((p) =>
        `${p.name} ${p.description}`.toLowerCase().includes(q),
      )
    : [];
  const matchedMembers = q
    ? members.filter((m) => `${m.user.name} ${ORG_ROLE_LABEL[m.role]}`.toLowerCase().includes(q))
    : [];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Search</h1>
          <div className="page-sub">
            Find anything across your Seyora workspace.
          </div>
        </div>
      </div>
      <div className="card card-pad">
        <div className="search" style={{ maxWidth: "none", margin: 0 }}>
          <Search size={16} strokeWidth={1.8} />
          <input
            autoFocus
            placeholder="Search tasks, projects, members, comments..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {!q ? (
          <div className="empty">
            <div className="empty-icon">
              <Search size={20} />
            </div>
            <strong>Start searching</strong>
            <div className="small muted">
              Use the command palette with Ctrl/⌘ K from anywhere.
            </div>
          </div>
        ) : matchedProjects.length === 0 && matchedMembers.length === 0 ? (
          <div className="empty">
            <strong>No results found</strong>
          </div>
        ) : (
          <>
            {matchedProjects.length > 0 ? (
              <div style={{ marginTop: 20 }}>
                <div className="tiny muted" style={{ marginBottom: 8 }}>
                  Projects
                </div>
                <div className="grid g3">
                  {matchedProjects.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              </div>
            ) : null}
            {matchedMembers.length > 0 ? (
              <div style={{ marginTop: 20 }}>
                <div className="tiny muted" style={{ marginBottom: 8 }}>
                  Members
                </div>
                {matchedMembers.map((m) => (
                  <div key={m.user.id} className="list-row">
                    <Avatar url={m.user.avatarUrl} initials={m.user.initials} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 650 }}>
                        {m.user.name}
                      </div>
                      <div className="tiny muted">{ORG_ROLE_LABEL[m.role]}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
