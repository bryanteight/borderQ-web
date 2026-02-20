export interface TrendData {
  status: 'RISING' | 'FALLING' | 'STABLE';
  delta_minutes?: number; // Optional in case backend omits it
  message: string;
}

export interface BorderEvent {
  id: string;
  crossing_name: string;
  wait_time_minutes: number;
  official_avg_minutes?: number;  // Official average wait time from CBP for comparison
  status: "Fastest" | "Moderate" | "Heavy Traffic" | "Closed" | "Report";
  weather_condition: string;
  temperature: number; // In Fahrenheit
  slug?: string; // New: SEO-friendly slug (e.g., "peace-arch")
  trend?: TrendData;
  ai_summary: string;
  prediction?: string;
  standard_lanes_open?: number;
  nexus_lanes_open?: number;
  direction?: string;
  region?: string; // Region key (e.g., "cascadia", "detroit", "niagara")
  last_sync?: string; // ISO string from backend
  source_note?: string;
  smart_insight?: {
    icon: 'surge' | 'clearing' | 'fast' | 'rising' | 'stable';
    verdict: string;
    detail: string;
  };
  forecast_points?: number[];
  typical_points?: number[]; // Baseline for comparison
  timeline_labels?: string[];
  event_alert?: EventAlert; // Event alert data from backend
  has_cameras?: boolean;
  // Vision Enrichment (Phase 7 — Camera AI)
  camera_insight?: {
    icon: string;
    verdict: string;
    detail: string;
    severity: 'clear' | 'normal' | 'busy' | 'warning' | 'info';
    car_count: number;
  };
  // Phase 8: Smart Analysis (DSPy Pulse)
  smart_analysis?: string;
  // [NEW] Nowcast / Recommendation Fields
  forecast_tier?: string;
  forecast_method?: string;
  forecast_samples?: number;
  recommendation?: {
    action: "GO_NOW" | "HOLD" | "DETOUR";
    title: string;
    description: string;
  };
}

export interface EventAlert {
  level: 'CRITICAL' | 'WARNING' | 'ADVISORY' | 'INFO';
  name: string;
  venue: string;
  type: string;
  starts_at: string;
  hours_until: number;
  hours_until_end: number;
  expected_attendance: number;
  url?: string;
  description?: string;
}

export interface PlanningData {
  date: string;
  dayName: string;
  dayLabel: string;
  status: 'green' | 'yellow' | 'red';
  worstTime: string;
  impactBadge?: string;
  impactType?: string;
  slug: string;
  avgWait: number;
  html_report?: string;  // DSPy-generated AI analysis
}

export interface SummaryResponse {
  timestamp?: string;
  type: string;
  data: BorderEvent[];
  planning?: {
    SOUTHBOUND: PlanningData[];
    NORTHBOUND: PlanningData[];
  };
  message: string;
}
