"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { selectUser } from "@/redux/users/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import ProjectStatus from "@/components/projects/ProjectStatus";

export default function UserDetailsPage({ userId }: { userId: string }) {
  const dispatch = useAppDispatch();
  const { list: users, loading } = useAppSelector((state) => state.users);
  const projects = useAppSelector((state) => state.projects.list);
  const user = users.find((u) => u.id === userId);

  useEffect(() => {
    dispatch(selectUser(userId));
    return () => {
      dispatch(selectUser(null));
    };
  }, [dispatch, userId]);

  if (!loading && users.length && !user) notFound();

  const memberProjects = user ? projects.filter((p) => p.team.some((m) => m.id === user.id)) : [];

  return (
    <div className="page">
      <div className="card" style={{ padding: 20 }}>
        <div className="tiny muted" style={{ marginBottom: 10 }}>
          <Link href="/users" className="link">
            Team
          </Link>{" "}
          / {user?.name ?? "Loading…"}
        </div>
        {user ? (
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <span className="avatar" style={{ width: 56, height: 56, fontSize: 18 }}>
              {user.initials}
            </span>
            <div>
              <div style={{ fontSize: 22, fontWeight: 760 }}>{user.name}</div>
              <div className="muted small" style={{ marginTop: 4 }}>
                {user.role} · {user.email}
              </div>
            </div>
          </div>
        ) : (
          <div className="skeleton" style={{ height: 56, width: 240 }} />
        )}
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="panel-head">
          <span className="card-title">Assigned projects</span>
          <span className="tiny muted">{memberProjects.length} total</span>
        </div>
        {memberProjects.length === 0 ? (
          <div className="empty">
            <strong>No projects assigned</strong>
          </div>
        ) : (
          <div>
            {memberProjects.map((p) => (
              <Link key={p.id} href={`/projects/${p.slug}`} className="list-row">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 650, fontSize: 12 }}>{p.name}</div>
                  <div className="tiny muted">{p.taskCount} tasks</div>
                </div>
                <ProjectStatus status={p.status} />
                <span className="tiny" style={{ minWidth: 40, textAlign: "right" }}>
                  {p.progress}%
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
