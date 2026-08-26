"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Plus, SlidersHorizontal } from "lucide-react";
import { useProjects } from "@/lib/context/projects-context";
import type {
  Project,
  ProjectSortKey,
  ProjectStatusFilter,
  ProjectViewMode,
} from "@/types/project";
import ProjectCard from "./ProjectCard";
import ProjectFiltersPanel, { type DueDateRange } from "./ProjectFiltersPanel";
import ProjectList from "./ProjectList";
import ProjectSummary from "./ProjectSummary";
import ProjectToolbar from "./ProjectToolbar";

const VIEW_STORAGE_KEY = "Seyora-project-view";

function sortProjects(projects: Project[], sortKey: ProjectSortKey): Project[] {
  const sorted = [...projects];
  switch (sortKey) {
    case "progress":
      return sorted.sort((a, b) => b.progress - a.progress);
    case "due-date":
      return sorted.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "recently-updated":
    default:
      return sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
}

export default function ProjectsPage() {
  const { projects, openCreateModal } = useProjects();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [statusFilter, setStatusFilter] = useState<ProjectStatusFilter>("all");
  const [teamFilter, setTeamFilter] = useState("all");
  const [dueDateRange, setDueDateRange] = useState<DueDateRange>(null);
  const [sortKey, setSortKey] = useState<ProjectSortKey>("recently-updated");
  const [viewMode, setViewMode] = useState<ProjectViewMode>("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    // Reads browser storage after hydration on purpose: the server always
    // renders "grid", and this brings the client in sync with the visitor's
    // saved preference without causing a hydration mismatch.
    const stored = window.localStorage.getItem(VIEW_STORAGE_KEY);
    if (stored === "grid" || stored === "list") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setViewMode(stored);
    }
  }, []);

  const handleViewModeChange = (mode: ProjectViewMode) => {
    setViewMode(mode);
    try {
      window.localStorage.setItem(VIEW_STORAGE_KEY, mode);
    } catch {
      // ignore write errors (private browsing, storage disabled, etc.)
    }
  };

  const teamOptions = useMemo(() => {
    const seen = new Map<string, Project["team"][number]>();
    projects.forEach((p) =>
      p.team.forEach((member) => seen.set(member.id, member)),
    );
    return Array.from(seen.values());
  }, [projects]);

  const activeFilterCount =
    (statusFilter !== "all" ? 1 : 0) + (teamFilter !== "all" ? 1 : 0) + (dueDateRange ? 1 : 0);
  const hasAnyFilterOrSearch = activeFilterCount > 0 || search.trim().length > 0;

  const clearAllFilters = () => {
    setStatusFilter("all");
    setTeamFilter("all");
    setDueDateRange(null);
  };

  const clearEverything = () => {
    clearAllFilters();
    setSearch("");
  };

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = projects.filter((p) => {
      const matchesQuery =
        !query || `${p.name} ${p.description}`.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      const matchesTeam =
        teamFilter === "all" ||
        p.team.some((member) => member.id === teamFilter);
      const matchesDueDate =
        !dueDateRange || (p.dueDate >= dueDateRange[0] && p.dueDate <= dueDateRange[1]);
      return matchesQuery && matchesStatus && matchesTeam && matchesDueDate;
    });
    return sortProjects(filtered, sortKey);
  }, [projects, search, statusFilter, teamFilter, dueDateRange, sortKey]);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow">Workspace / Delivery</div>
          <h1 className="page-title">Projects</h1>
          <div className="page-sub">
            A focused view of every engineering initiative, milestone and
            delivery stream.
          </div>
        </div>
        <div className="actions">
          <button
            type="button"
            className={`btn ${activeFilterCount > 0 ? "active" : ""}`}
            onClick={() => setFiltersOpen(true)}
          >
            <SlidersHorizontal size={15} />
            Filters
            {activeFilterCount > 0 ? <span className="badge badge-progressing">{activeFilterCount}</span> : null}
          </button>
          <button
            type="button"
            className="btn primary"
            onClick={openCreateModal}
          >
            <Plus size={15} />
            Create project
          </button>
        </div>
      </div>

      <ProjectSummary projects={projects} />

      <ProjectToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        teamFilter={teamFilter}
        onTeamFilterChange={setTeamFilter}
        teamOptions={teamOptions}
        sortKey={sortKey}
        onSortKeyChange={setSortKey}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />

      <ProjectFiltersPanel
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        teamFilter={teamFilter}
        onTeamFilterChange={setTeamFilter}
        teamOptions={teamOptions}
        dueDateRange={dueDateRange}
        onDueDateRangeChange={setDueDateRange}
        activeFilterCount={activeFilterCount}
        onClearAll={clearAllFilters}
      />

      {filteredProjects.length === 0 ? (
        <div className="card empty">
          <strong>No projects found</strong>
          <div className="muted small" style={{ marginTop: 6 }}>
            Try a different search term or clear your filters.
          </div>
          {hasAnyFilterOrSearch ? (
            <button type="button" className="btn" style={{ marginTop: 14 }} onClick={clearEverything}>
              Clear search &amp; filters
            </button>
          ) : null}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid g3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <ProjectList projects={filteredProjects} />
      )}
    </div>
  );
}
