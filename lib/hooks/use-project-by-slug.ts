import { useAppSelector } from "@/redux/hooks";

// Shared by every /projects/:slug/* page. `state.projects.list` is fetched
// once (app-wide, via AppShell's bootstrap) and starts empty — reusing it
// here avoids a redundant GET /projects/:slug call, but callers must not
// treat "not found yet" the same as "confirmed missing": `loading: true`
// means the fetch hasn't resolved, not that the slug is invalid.
export function useProjectBySlug(slug: string) {
  const { list, loading } = useAppSelector((state) => state.projects);
  const project = list.find((p) => p.slug === slug);
  return { project, loading };
}
