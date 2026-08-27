import { useEffect } from "react";
import { fetchProjectTasksRequest } from "@/redux/tasks/action";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

// Mirrors use-project-by-slug.ts's "fetch once, read from Redux" shape.
// Dispatches a fetch only when the cached tasks don't match the requested
// project — without this guard, switching Board -> List -> Calendar ->
// Overview tabs on the same project would fire four avoidable requests.
export function useProjectTasks(projectId: string | undefined) {
  const dispatch = useAppDispatch();
  const { projectTasks, projectTasksProjectId, projectTasksLoading } = useAppSelector((state) => state.tasks);

  const stale = projectId !== undefined && projectTasksProjectId !== projectId;

  useEffect(() => {
    if (projectId && stale) {
      dispatch(fetchProjectTasksRequest(projectId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, stale]);

  return {
    tasks: stale ? [] : projectTasks,
    loading: stale || projectTasksLoading,
  };
}
