"use client";

import { Modal } from "antd";
import { Check, Folder, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { workspaceTasks } from "@/lib/data/global-tasks";
import { useProjects } from "@/lib/context/projects-context";
import { useAppRouter } from "@/lib/hooks/use-app-router";
import { scrollableModalStyles } from "@/lib/modal-styles";
import { useAppSelector } from "@/redux/hooks";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  initialQuery?: string;
}

type ResultKind = "project" | "user" | "task";

interface Result {
  kind: ResultKind;
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  onSelect: () => void;
}

export default function CommandPalette({ open, onClose, initialQuery = "" }: CommandPaletteProps) {
  const router = useAppRouter();
  const { projects } = useProjects();
  const users = useAppSelector((state) => state.users.list);
  const [query, setQuery] = useState(initialQuery);

  const go = (href: string) => {
    router.push(href);
    onClose();
  };

  const results = useMemo<Result[]>(() => {
    const projectResults: Result[] = projects.map((p) => ({
      kind: "project",
      id: p.id,
      title: p.name,
      subtitle: p.description,
      badge: `${p.progress}%`,
      onSelect: () => go(`/projects/${p.slug}`),
    }));
    const userResults: Result[] = users.map((u) => ({
      kind: "user",
      id: u.id,
      title: u.name,
      subtitle: u.role,
      badge: "Member",
      onSelect: () => go(`/users/${u.id}`),
    }));
    const taskResults: Result[] = workspaceTasks.map((t) => ({
      kind: "task",
      id: t.id,
      title: `${t.id} · ${t.title}`,
      subtitle: t.projectName,
      badge: t.status,
      onSelect: () => go(`/projects/${t.projectSlug}`),
    }));

    const all = [...projectResults, ...userResults, ...taskResults];
    const q = query.trim().toLowerCase();
    if (!q) return all.slice(0, 8);
    return all.filter((r) => `${r.title} ${r.subtitle}`.toLowerCase().includes(q)).slice(0, 12);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects, users, query]);

  const iconFor = (kind: ResultKind) =>
    kind === "task" ? <Check size={16} /> : kind === "project" ? <Folder size={16} /> : <Users size={16} />;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={null}
      closable={false}
      width={640}
      destroyOnHidden
      centered
      styles={scrollableModalStyles}
    >
      <div className="search" style={{ maxWidth: "none", margin: 0 }}>
        <Search size={16} strokeWidth={1.8} />
        <input
          autoFocus
          placeholder="Search tasks, projects, members..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="command-results">
        {results.length === 0 ? (
          <div className="empty">
            <strong>No results</strong>
            <div className="small muted">Try a different search term.</div>
          </div>
        ) : (
          results.map((r) => (
            <div key={`${r.kind}-${r.id}`} className="command-result" onClick={r.onSelect}>
              <span className="project-icon" style={{ width: 32, height: 32 }}>
                {iconFor(r.kind)}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong>{r.title}</strong>
                <div className="tiny muted" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {r.subtitle}
                </div>
              </div>
              <span className="badge badge-gray">{r.badge}</span>
            </div>
          ))
        )}
      </div>
      <div className="divider">Press Esc to close · Ctrl/⌘ K anytime</div>
    </Modal>
  );
}
