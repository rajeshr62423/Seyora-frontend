"use client";

import { Select } from "antd";
import { Grid2x2, List, Search } from "lucide-react";
import type { ProjectSortKey, ProjectStatusFilter, ProjectViewMode } from "@/types/project";
import type { User } from "@/types/user";
import ProjectFilters from "./ProjectFilters";

const SORT_OPTIONS: { value: ProjectSortKey; label: string }[] = [
  { value: "recently-updated", label: "Recently updated" },
  { value: "due-date", label: "Due date" },
  { value: "name", label: "Name" },
];

interface ProjectToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: ProjectStatusFilter;
  onStatusFilterChange: (value: ProjectStatusFilter) => void;
  teamFilter: string;
  onTeamFilterChange: (value: string) => void;
  teamOptions: User[];
  sortKey: ProjectSortKey;
  onSortKeyChange: (value: ProjectSortKey) => void;
  viewMode: ProjectViewMode;
  onViewModeChange: (value: ProjectViewMode) => void;
}

export default function ProjectToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  teamFilter,
  onTeamFilterChange,
  teamOptions,
  sortKey,
  onSortKeyChange,
  viewMode,
  onViewModeChange,
}: ProjectToolbarProps) {
  return (
    <div className="toolbar">
      <div className="search">
        <Search size={16} strokeWidth={1.8} />
        <input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search projects"
        />
      </div>

      <ProjectFilters
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        teamFilter={teamFilter}
        onTeamFilterChange={onTeamFilterChange}
        teamOptions={teamOptions}
      />

      <Select<ProjectSortKey>
        value={sortKey}
        onChange={onSortKeyChange}
        options={SORT_OPTIONS}
        style={{ minWidth: 170 }}
        aria-label="Sort projects"
      />

      <div className="view-switch" role="group" aria-label="Toggle project view">
        <button
          type="button"
          className={viewMode === "grid" ? "active" : ""}
          onClick={() => onViewModeChange("grid")}
          title="Grid view"
          aria-label="Grid view"
        >
          <Grid2x2 size={16} strokeWidth={1.8} />
        </button>
        <button
          type="button"
          className={viewMode === "list" ? "active" : ""}
          onClick={() => onViewModeChange("list")}
          title="List view"
          aria-label="List view"
        >
          <List size={16} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}
