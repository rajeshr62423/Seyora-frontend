"use client";

import { DatePicker, Drawer, Radio } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import type { CSSProperties } from "react";
import { STATUS_FILTER_OPTIONS } from "@/lib/status";
import type { ProjectStatusFilter } from "@/types/project";
import type { User } from "@/types/user";

const { RangePicker } = DatePicker;

export type DueDateRange = [string, string] | null;

interface ProjectFiltersPanelProps {
  open: boolean;
  onClose: () => void;
  statusFilter: ProjectStatusFilter;
  onStatusFilterChange: (value: ProjectStatusFilter) => void;
  teamFilter: string;
  onTeamFilterChange: (value: string) => void;
  teamOptions: User[];
  dueDateRange: DueDateRange;
  onDueDateRangeChange: (value: DueDateRange) => void;
  activeFilterCount: number;
  onClearAll: () => void;
}

const sectionLabelStyle: CSSProperties = {
  marginBottom: 10,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  fontWeight: 700,
};

export default function ProjectFiltersPanel({
  open,
  onClose,
  statusFilter,
  onStatusFilterChange,
  teamFilter,
  onTeamFilterChange,
  teamOptions,
  dueDateRange,
  onDueDateRangeChange,
  activeFilterCount,
  onClearAll,
}: ProjectFiltersPanelProps) {
  const rangeValue: [Dayjs, Dayjs] | null = dueDateRange ? [dayjs(dueDateRange[0]), dayjs(dueDateRange[1])] : null;

  return (
    <Drawer
      title="Filter projects"
      open={open}
      onClose={onClose}
      placement="right"
      size={340}
      maskClosable
      extra={
        activeFilterCount > 0 ? (
          <button type="button" className="btn ghost" style={{ height: 30 }} onClick={onClearAll}>
            Clear all
          </button>
        ) : null
      }
    >
      <div style={{ display: "grid", gap: 26 }}>
        <div>
          <div className="tiny muted" style={sectionLabelStyle}>
            Status
          </div>
          <Radio.Group
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}
          >
            {STATUS_FILTER_OPTIONS.map((opt) => (
              <Radio key={opt.value} value={opt.value}>
                {opt.label}
              </Radio>
            ))}
          </Radio.Group>
        </div>

        <div>
          <div className="tiny muted" style={sectionLabelStyle}>
            Team member
          </div>
          <Radio.Group
            value={teamFilter}
            onChange={(e) => onTeamFilterChange(e.target.value)}
            style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}
          >
            <Radio value="all">All team members</Radio>
            {teamOptions.map((u) => (
              <Radio key={u.id} value={u.id}>
                {u.name}
              </Radio>
            ))}
          </Radio.Group>
        </div>

        <div>
          <div className="tiny muted" style={sectionLabelStyle}>
            Due date range
          </div>
          <RangePicker
            value={rangeValue}
            onChange={(values) => {
              if (!values || !values[0] || !values[1]) {
                onDueDateRangeChange(null);
                return;
              }
              onDueDateRangeChange([values[0].format("YYYY-MM-DD"), values[1].format("YYYY-MM-DD")]);
            }}
            style={{ width: "100%" }}
            allowClear
          />
          <div className="help" style={{ marginTop: 8 }}>
            Optional — narrows results to projects due within this range.
          </div>
        </div>
      </div>
    </Drawer>
  );
}
