import { useEffect } from "react";
import { fetchTaskByCodeRequest } from "@/redux/tasks/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

// Mirrors use-project-tasks.ts's "fetch once, only when stale" shape. A
// dedicated fetch (not a lookup in projectTasks/myTasks) is required here
// because the task-detail page must work on a hard refresh, when neither
// list has necessarily been loaded yet — the task might not even belong to
// the viewer (not assigned to them, from a project they haven't opened).
export function useTaskByCode(code: string) {
  const dispatch = useAppDispatch();
  const { taskDetail, taskDetailCode, taskDetailLoading, taskDetailError } = useAppSelector((state) => state.tasks);

  const stale = taskDetailCode !== code;

  useEffect(() => {
    if (stale) dispatch(fetchTaskByCodeRequest(code));
  }, [code, stale]);

  return {
    task: stale ? undefined : (taskDetail ?? undefined),
    loading: stale || taskDetailLoading,
    error: taskDetailError,
  };
}
