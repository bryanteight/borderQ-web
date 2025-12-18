import Link from "next/link";
import { BorderEvent } from "@/lib/types";
import { TrendingDown, TrendingUp, Minus, Cloud, Droplets, Sun, Thermometer, ChevronRight, Car, Zap, Activity, Info } from "lucide-react";
import { clsx } from "clsx";

interface StatusCardProps {
  event: BorderEvent;
  isFastest?: boolean;
}

export function StatusCard({ event }: { event: BorderEvent }) {
  const isClosed = event.status === "Closed";

  // Get weather icon based on condition
  const getWeatherIcon = () => {
    const condition = event.weather_condition.toLowerCase();
    if (condition.includes("rain") || condition.includes("drizzle") || condition.includes("shower") || condition.includes("snow")) {
      return <Droplets className="w-4 h-4 text-sky-500" />;
    }
    if (condition.includes("sun") || condition.includes("clear")) {
      return <Sun className="w-4 h-4 text-amber-500" />;
    }
    return <Cloud className="w-4 h-4 text-gray-400" />;
  };

  const borderColor = "border-gray-200 hover:border-gray-300 hover:shadow-xl hover:shadow-indigo-500/10";

  // Smart Wait Recommendation (Backend Driven)
  const smartRecommendation = event.trend?.status === "FALLING" ? event.trend : null;

  // Traffic Color Logic
  const trafficColor = isClosed
    ? "text-gray-300"
    : event.wait_time_minutes > 45
      ? "text-red-500"
      : event.wait_time_minutes > 20
        ? "text-amber-500"
        : "text-emerald-500";
  // Clean dashboard aesthetic: No borders, soft shadow, pure white
  const cardStyle = "bg-white rounded-[32px] shadow-[0_2px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 border border-transparent hover:border-indigo-50 cursor-pointer group";

  // Generate slug from name for SEO URL
  const slug = event.crossing_name.toLowerCase().replace(/\s+/g, '-');

  // Get current day name (e.g., "Sunday") for the dynamic route
  // In a real app, this should ideally match the timezone of the border (Pacific Time)
  const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <Link href={`/stats/${slug}/${dayName}`} className="block h-full">
      <div className={clsx("relative h-full p-5 md:p-8", cardStyle)}>
        {/* Hover Affordance (Chevron) - Moved to Bottom Right to make room for Badge */}
        <div className="absolute bottom-5 right-5 md:bottom-8 md:right-8 text-slate-300 group-hover:text-indigo-600 transition-colors group-hover:translate-x-1 duration-300">
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </div>

        {/* Vehicle Badge (Passenger) - Top Right */}
        <div className="absolute top-5 right-5 md:top-8 md:right-8 flex items-center gap-1 bg-slate-50 text-slate-400 px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider border border-slate-100">
          <Car className="w-3 h-3" />
          <span>Passenger</span>
        </div>

        {/* Smart Wait Badge (Moved to maintain layout balance, if exists) */}
        {smartRecommendation && (
          <span className="absolute top-4 right-12 md:top-6 md:right-16 px-2 py-0.5 md:px-3 md:py-1 bg-violet-50 text-violet-700 text-[10px] md:text-[11px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 border border-violet-100/50">
            <TrendingDown className="w-3 h-3 md:w-3.5 md:h-3.5" />
            {smartRecommendation.message.replace("Save", "Save").split(" ")[0] === "Save" ? "Save Time" : "Optimization"}
          </span>
        )}

        {/* Header */}
        <div className="flex flex-col gap-1 mb-4 md:mb-8">
          <h3 className="text-xl md:text-2xl font-[800] text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors flex items-center gap-2">
            {event.crossing_name}
          </h3>
          {isClosed ? (
            <span className="text-red-500 font-bold text-xs md:text-sm">Closed</span>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 relative group/source">
                <span className="text-slate-400 font-medium text-xs md:text-sm tracking-wide uppercase whitespace-nowrap">Current Wait</span>
                {event.source_note && (
                  <div className="flex items-center cursor-help">
                    <span className="flex items-center gap-1 px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-bold uppercase tracking-tight rounded-md border border-indigo-100/50 group-hover/source:bg-indigo-100 transition-colors">
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21a9.003 9.003 0 008.367-5.657M12 21a9.003 9.003 0 01-8.367-5.657m16.734 0A11.955 11.955 0 0112 12.056V21" />
                      </svg>
                      Hybrid: CBP + DriveBC
                    </span>
                    {/* Tooltip Content - Optimized for Mobile & Desktop */}
                    <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-slate-900/95 backdrop-blur shadow-2xl text-white text-[10px] md:text-[11px] leading-relaxed rounded-xl opacity-0 group-hover/source:opacity-100 group-active/source:opacity-100 pointer-events-none transition-all duration-200 z-50 transform translate-y-2 group-hover/source:translate-y-0 text-center md:text-left">
                      <div className="font-bold mb-1 text-indigo-300">Data Source Fusion</div>
                      {event.source_note}
                      <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-slate-900" />
                    </div>
                  </div>
                )}
              </div>
              {event.standard_lanes_open !== undefined && event.standard_lanes_open !== null && (
                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-tighter rounded-md border border-emerald-100/50">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  {event.standard_lanes_open} {event.standard_lanes_open === 1 ? "Lane" : "Lanes"} Open
                </span>
              )}
            </div>
          )}
        </div>

        {/* Main Wait Time Display & Typical */}
        <div className="flex items-end gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Current */}
          <div className="flex items-baseline gap-1">
            <div className={clsx(
              "text-6xl md:text-8xl font-[800] tracking-tighter leading-none transition-colors duration-300",
              trafficColor
            )}>
              {event.wait_time_minutes}
            </div>
            <div className="text-xl md:text-2xl font-bold text-slate-300 transform -translate-y-1 md:-translate-y-2">min</div>
          </div>

          {/* Typical (Aside) */}
          {event.official_avg_minutes !== undefined && event.official_avg_minutes !== null && (
            <div className="flex flex-col mb-3 pl-6 border-l-2 border-slate-100/80">
              <span className="text-[11px] font-[700] text-slate-400 uppercase tracking-widest mb-0.5">Typical</span>
              <span className="text-2xl font-[700] text-slate-400">
                {event.official_avg_minutes} <span className="text-sm font-semibold text-slate-300">min</span>
              </span>
            </div>
          )}
        </div>

        {/* Footer Info Row - Smart Insight */}
        <div className="pt-5 mt-auto border-t border-slate-50 flex items-start justify-between group-hover:border-indigo-100 transition-colors">
          <div className="flex flex-col gap-1.5 flex-1 min-w-0 pr-4">
            {event.smart_insight ? (
              <>
                <div className="flex items-center gap-2">
                  <div className={clsx(
                    "p-1 rounded-md",
                    event.smart_insight.icon === 'surge' && "bg-red-50 text-red-600",
                    event.smart_insight.icon === 'clearing' && "bg-orange-50 text-orange-600",
                    event.smart_insight.icon === 'fast' && "bg-emerald-50 text-emerald-600",
                    event.smart_insight.icon === 'rising' && "bg-amber-50 text-amber-600",
                    event.smart_insight.icon === 'stable' && "bg-slate-50 text-slate-500",
                  )}>
                    {event.smart_insight.icon === 'surge' && <Activity className="w-3.5 h-3.5" />}
                    {event.smart_insight.icon === 'clearing' && <TrendingDown className="w-3.5 h-3.5" />}
                    {event.smart_insight.icon === 'fast' && <Zap className="w-3.5 h-3.5" />}
                    {event.smart_insight.icon === 'rising' && <TrendingUp className="w-3.5 h-3.5" />}
                    {event.smart_insight.icon === 'stable' && <Minus className="w-3.5 h-3.5" />}
                  </div>
                  <span className={clsx(
                    "text-[13px] font-[900] uppercase tracking-tight",
                    event.smart_insight.icon === 'surge' && "text-red-700",
                    event.smart_insight.icon === 'clearing' && "text-orange-700",
                    event.smart_insight.icon === 'fast' && "text-emerald-700",
                    event.smart_insight.icon === 'rising' && "text-amber-700",
                    event.smart_insight.icon === 'stable' && "text-slate-600",
                  )}>
                    {event.smart_insight.verdict}
                  </span>
                </div>
                <p className="text-[13px] leading-snug font-bold text-slate-600 mt-0.5">
                  {event.smart_insight.detail}
                </p>
              </>
            ) : (
              <p className={clsx(
                "text-base leading-relaxed font-serif italic text-left",
                event.trend?.status === 'FALLING' ? "text-emerald-700" : "text-slate-500"
              )}>
                {smartRecommendation ? smartRecommendation.message : (event.prediction || "Steady flow")}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end shrink-0 ml-4 group-hover:translate-x-1 transition-transform">
            <span className="text-indigo-600 font-bold text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap">
              View Stats
            </span>
            {event.last_sync && (
              <span className="text-[10px] font-bold text-slate-400 mt-1 tabular-nums whitespace-nowrap bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100/50">
                {(() => {
                  const diff = Math.floor((new Date().getTime() - new Date(event.last_sync).getTime()) / 60000);
                  if (diff <= 0) return "JUST NOW";
                  if (diff === 1) return "1M AGO";
                  return `${diff}M AGO`;
                })()}
              </span>
            )}
          </div>
        </div>

        {/* Background Decor (Subtle gradient blob) */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-transparent rounded-bl-[100px] pointer-events-none opacity-50 group-hover:from-indigo-50/50 transition-all" />
      </div>
    </Link >
  );
}
