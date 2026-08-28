"use client";

import { useMemo } from "react";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import { useAppRouter } from "@/lib/hooks/use-app-router";
import { useAppSelector } from "@/redux/hooks";

export default function CalendarPage() {
  const router = useAppRouter();
  const myTasks = useAppSelector((state) => state.tasks.myTasks);

  const chips = useMemo(
    () =>
      myTasks
        .filter((t) => t.dueDate !== null)
        .map((t) => ({ id: t.id, label: t.title, date: t.dueDate!, onClick: () => router.push(`/tasks/${t.code}`) })),
    [myTasks, router],
  );

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Calendar</h1>
          <div className="page-sub">Project deadlines and scheduled work across your workspace.</div>
        </div>
      </div>
      <CalendarGrid chips={chips} />
    </div>
  );
}
