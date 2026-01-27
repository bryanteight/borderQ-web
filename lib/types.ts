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
  smart_analysis?: {
    intro: string;
    savings_analysis: string;
  };
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
