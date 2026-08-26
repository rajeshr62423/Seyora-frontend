"use client";

import CalendarGrid from "@/components/calendar/CalendarGrid";
import { useSelectedTask } from "@/lib/context/selected-task-context";
import { workspaceTasks } from "@/lib/data/global-tasks";

export default function CalendarPage() {
  const { openTask } = useSelectedTask();

  const chips = workspaceTasks.map((t) => ({
    id: t.id,
    label: t.title,
    date: t.dueDate,
    onClick: () => openTask(t),
  }));

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
