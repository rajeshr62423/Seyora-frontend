import { useEffect } from "react";
import { fetchTaskActivityRequest } from "@/redux/activity/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

// Same "fetch once, only when stale" shape as use-task-by-code.ts. Reads
// from a dedicated slot (state.activity.taskActivity*), never the shared
// state.activity.items feed — that field is relied on elsewhere
// (ActivityPage/ProjectActivityPage/AuditLogsTab/DashboardPage) to hold the
// full, unfiltered org feed and must never be overwritten by a scoped
// fetch.
export function useTaskActivity(taskId: string | undefined) {
  const dispatch = useAppDispatch();
  const { taskActivityItems, taskActivityTaskId, taskActivityLoading, taskActivityError } = useAppSelector(
    (state) => state.activity,
  );

  const stale = taskId !== undefined && taskActivityTaskId !== taskId;

  useEffect(() => {
    if (taskId && stale) dispatch(fetchTaskActivityRequest(taskId));
  }, [taskId, stale]);

  return {
    items: stale ? [] : taskActivityItems,
    loading: stale || taskActivityLoading,
    error: taskActivityError,
  };
}
