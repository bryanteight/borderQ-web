import Link from "next/link";
import { BorderEvent } from "@/lib/types";
import { TrendingDown, TrendingUp, Minus, Cloud, Droplets, Sun, Thermometer, ChevronRight } from "lucide-react";
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
      <div className={clsx("relative h-full p-8", cardStyle)}>
        {/* Hover Affordance (Chevron) */}
        <div className="absolute top-8 right-8 text-slate-300 group-hover:text-indigo-600 transition-colors group-hover:translate-x-1 duration-300">
          <ChevronRight className="w-6 h-6" />
        </div>

        {/* Smart Wait Badge (Moved to maintain layout balance, if exists) */}
        {smartRecommendation && (
          <span className="absolute top-6 right-16 px-3 py-1 bg-violet-50 text-violet-700 text-[11px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 border border-violet-100/50">
            <TrendingDown className="w-3.5 h-3.5" />
            {smartRecommendation.message.replace("Save", "Save").split(" ")[0] === "Save" ? "Save Time" : "Optimization"}
          </span>
        )}

        {/* Header */}
        <div className="flex flex-col gap-1 mb-8">
          <h3 className="text-2xl font-[800] text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors flex items-center gap-2">
            {event.crossing_name}
          </h3>
          {isClosed ? (
            <span className="text-red-500 font-bold text-sm">Closed</span>
          ) : (
            <span className="text-slate-400 font-medium text-sm tracking-wide uppercase">Current Wait</span>
          )}
        </div>

        {/* Main Wait Time Display & Typical */}
        <div className="flex items-end gap-6 mb-8">
          {/* Current */}
          <div className="flex items-baseline gap-1">
            <div className={clsx(
              "text-8xl font-[800] tracking-tighter leading-none transition-colors duration-300",
              trafficColor
            )}>
              {event.wait_time_minutes}
            </div>
            <div className="text-2xl font-bold text-slate-300 transform -translate-y-2">min</div>
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

        {/* Footer Info Row - Summary Only */}
        <div className="pt-6 border-t border-slate-50 flex items-center justify-between group-hover:border-indigo-100 transition-colors">
          <p className={clsx(
            "text-base leading-relaxed font-serif italic text-left pr-4",
            event.trend?.status === 'FALLING' ? "text-emerald-700" : "text-slate-500"
          )}>
            {smartRecommendation ? smartRecommendation.message : (event.prediction || "Steady flow")}
          </p>
          <span className="text-indigo-600 font-bold text-xs uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap">
            View Stats
          </span>
        </div>

        {/* Background Decor (Subtle gradient blob) */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-transparent rounded-bl-[100px] pointer-events-none opacity-50 group-hover:from-indigo-50/50 transition-all" />
      </div>
    </Link>
  );
}
