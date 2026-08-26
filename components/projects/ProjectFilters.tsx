"use client";

import { Select } from "antd";
import { SlidersHorizontal, Users } from "lucide-react";
import { STATUS_FILTER_OPTIONS } from "@/lib/status";
import type { ProjectStatusFilter } from "@/types/project";
import type { User } from "@/types/user";

interface ProjectFiltersProps {
  statusFilter: ProjectStatusFilter;
  onStatusFilterChange: (value: ProjectStatusFilter) => void;
  teamFilter: string;
  onTeamFilterChange: (value: string) => void;
  teamOptions: User[];
}

export default function ProjectFilters({
  statusFilter,
  onStatusFilterChange,
  teamFilter,
  onTeamFilterChange,
  teamOptions,
}: ProjectFiltersProps) {
  return (
    <>
      <Select<ProjectStatusFilter>
        value={statusFilter}
        onChange={onStatusFilterChange}
        options={STATUS_FILTER_OPTIONS}
        style={{ minWidth: 150 }}
        suffixIcon={<SlidersHorizontal size={14} />}
        aria-label="Filter by status"
      />
      <Select
        value={teamFilter}
        onChange={onTeamFilterChange}
        style={{ minWidth: 150 }}
        suffixIcon={<Users size={14} />}
        aria-label="Filter by team member"
        options={[
          { value: "all", label: "All team members" },
          ...teamOptions.map((u) => ({ value: u.id, label: u.name })),
        ]}
      />
    </>
  );
}
