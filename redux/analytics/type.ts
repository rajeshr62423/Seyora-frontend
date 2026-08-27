import type { AnalyticsOverview, AnalyticsRange, TeamPerformanceRow } from "@/lib/api/analytics";

export interface AnalyticsState {
  overview: AnalyticsOverview | null;
  range: AnalyticsRange;
  overviewLoading: boolean;
  overviewError: string | null;

  teamPerformance: TeamPerformanceRow[];
  teamPerformanceLoading: boolean;
  teamPerformanceError: string | null;
}
