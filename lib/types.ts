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
  trend?: TrendData;
  ai_summary: string;
  prediction?: string;
  vision_insight?: string;
}

export interface SummaryResponse {
  type: string;
  data: BorderEvent[];
  message: string;
}
