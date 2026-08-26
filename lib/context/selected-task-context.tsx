"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { DetailTask } from "@/components/tasks/TaskDetailModal";

interface SelectedTaskContextValue {
  selectedTask: DetailTask | null;
  openTask: (task: DetailTask) => void;
  closeTask: () => void;
}

const SelectedTaskContext = createContext<SelectedTaskContextValue | null>(null);

export function SelectedTaskProvider({ children }: { children: ReactNode }) {
  const [selectedTask, setSelectedTask] = useState<DetailTask | null>(null);

  const openTask = useCallback((task: DetailTask) => setSelectedTask(task), []);
  const closeTask = useCallback(() => setSelectedTask(null), []);

  const value = useMemo(() => ({ selectedTask, openTask, closeTask }), [selectedTask, openTask, closeTask]);

  return <SelectedTaskContext.Provider value={value}>{children}</SelectedTaskContext.Provider>;
}

export function useSelectedTask() {
  const ctx = useContext(SelectedTaskContext);
  if (!ctx) throw new Error("useSelectedTask must be used within a SelectedTaskProvider");
  return ctx;
}
