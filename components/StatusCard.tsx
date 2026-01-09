import Link from "next/link";
import { BorderEvent } from "@/lib/types";
import { TrendingDown, TrendingUp, Minus, Activity, Car, Zap, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import { ForecastTeaser } from "./ForecastTeaser";
import { getSlugFromEvent, isEventClosed } from "@/lib/utils";

export function StatusCard({ event }: { event: BorderEvent }) {
  const isClosed = isEventClosed(event);
  const isNoData = event.wait_time_minutes === -1;

  // Traffic Color Logic
  const trafficColor = isClosed || isNoData
    ? "text-gray-300"
    : event.wait_time_minutes > 45
      ? "text-red-500"
      : event.wait_time_minutes > 20
        ? "text-amber-500"
        : "text-emerald-500";

  const cardStyle = "bg-white rounded-[32px] shadow-[0_2px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 border border-slate-200 hover:border-indigo-100 cursor-pointer group";

  // Navigation details
  const baseSlug = getSlugFromEvent(event);
  const isNorthbound = event.id.startsWith("NB_");

  const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const href = `/stats/${baseSlug}/${dayName}${isNorthbound ? '?direction=north' : ''}`;

  return (
    <Link href={href} className="block h-full group" prefetch={false}>
      <div className={clsx("relative h-full p-6 md:p-8 flex flex-col", cardStyle)}>
        {/* Header Section: Title Left, Badges Right */}
        <div className="flex justify-between items-start gap-4 mb-6">
          <div className="flex flex-col gap-1">
            {/* Dynamic Font Size based on Display Name Length to prevent wrapping */}
            {(() => {
              const displayName = event.crossing_name.replace(/\s*\(Northbound\)/i, '').replace(/\s*\(Southbound\)/i, '');
              const isLongName = displayName.length > 16; // e.g. "Peace Arch / Douglas" is 20 chars

              return (
                <h3 className={clsx(
                  "font-[900] text-[#0f172a] tracking-tight group-hover:text-indigo-600 transition-colors leading-tight flex items-end min-h-[3.5rem] md:min-h-[4rem]",
                  isLongName ? "text-lg md:text-2xl" : "text-2xl md:text-3xl"
                )}>
                  {displayName}
                </h3>
              );
            })()}

            {!isClosed && !isNoData && (
              <span className="text-[#94a3b8] font-black text-[10px] uppercase tracking-[0.2em] whitespace-nowrap mt-1">
                Current Wait
              </span>
            )}
            {isClosed && (
              <span className="text-red-500 font-[900] text-xs uppercase tracking-widest flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                Closed
              </span>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            {!isClosed && event.standard_lanes_open !== undefined && event.standard_lanes_open !== null && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-tight rounded-full shadow-lg shadow-emerald-100 transition-transform active:scale-95 whitespace-nowrap">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                {event.standard_lanes_open} {event.standard_lanes_open === 1 ? "Lane" : "Lanes"}
              </span>
            )}

            {/* [UX Move] View Details moved here to save space below */}
            <div className="flex items-center gap-0.5 text-[10px] font-bold text-indigo-600 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all ml-auto mt-1">
              <span>See details</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Hero Wait Time Row */}
        <div className="flex items-end gap-3 mb-8 relative">
          <div className="flex items-baseline gap-1">
            {isNoData ? (
              <span className="text-3xl md:text-4xl font-[900] tracking-tight leading-none text-gray-300">
                No data yet
              </span>
            ) : (
              <>
                <span className={clsx(
                  "text-6xl md:text-7xl font-[900] tracking-tighter leading-none transition-colors duration-500",
                  trafficColor
                )}>
                  {event.wait_time_minutes}
                </span>
                <span className="text-lg md:text-xl font-black text-slate-300 transform -translate-y-1">min</span>
              </>
            )}
          </div>

          {!isClosed && !isNoData && (
            <>
              <div className="h-10 w-px bg-slate-100 rounded-full mx-1 hidden sm:block" />
              <div className="flex items-end gap-2.5 pb-1">
                {event.official_avg_minutes !== undefined && event.official_avg_minutes !== null && event.official_avg_minutes > 0 && (
                  <div className="flex flex-col min-w-[50px]">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5 leading-none">Typical</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-2xl md:text-3xl font-[900] text-slate-400/80 tracking-tight leading-none">
                        {event.official_avg_minutes}
                      </span>
                      <span className="text-xs font-black text-slate-300">min</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-1 bg-slate-50 text-slate-400 px-2.5 py-1 rounded-full text-[9px] uppercase font-black tracking-widest border border-slate-100/60 shadow-sm mb-0.5 transform -translate-y-1">
                  <Car className="w-3 h-3 opacity-70" />
                  <span className="opacity-90">PAX</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer: Smart Insight OR Placeholder (Hidden if both missing or no data) */}
        {!isClosed && !isNoData && (event.smart_insight || (event.forecast_points && event.forecast_points.length > 1)) && (
          // Reduced padding (pt-6 -> pt-3) to close the gap
          <div className="pt-3 mt-auto border-t border-slate-50 flex flex-col gap-3 group-hover:border-indigo-100 transition-colors relative">
            <div className="flex flex-col gap-3">
              {/* "View Details" removed from here */}

              {event.forecast_points && event.forecast_points.length > 1 ? (
                <div className="w-full mt-1">
                  <ForecastTeaser currentWait={Math.max(0, event.wait_time_minutes)} forecastPoints={event.forecast_points} />
                </div>
              ) : event.smart_insight ? (
                <div className="flex items-start gap-3">
                  <div className={clsx(
                    "p-2 rounded-xl border shadow-sm backdrop-blur-[2px] transition-colors shrink-0",
                    event.smart_insight.icon === 'surge' && "bg-red-50 text-red-600 border-red-100",
                    event.smart_insight.icon === 'clearing' && "bg-orange-50 text-orange-600 border-orange-100",
                    event.smart_insight.icon === 'fast' && "bg-emerald-50 text-emerald-600 border-emerald-100",
                    event.smart_insight.icon === 'rising' && "bg-amber-50 text-amber-600 border-amber-100",
                    event.smart_insight.icon === 'stable' && "bg-slate-50 text-slate-400 border-slate-100",
                  )}>
                    {event.smart_insight.icon === 'surge' && <Activity className="w-5 h-5" />}
                    {event.smart_insight.icon === 'clearing' && <TrendingDown className="w-5 h-5" />}
                    {event.smart_insight.icon === 'fast' && <Zap className="w-5 h-5" />}
                    {event.smart_insight.icon === 'rising' && <TrendingUp className="w-5 h-5" />}
                    {event.smart_insight.icon === 'stable' && <Minus className="w-5 h-5" />}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className={clsx(
                      "text-xs font-[900] uppercase tracking-wide",
                      event.smart_insight.icon === 'surge' && "text-red-700",
                      event.smart_insight.icon === 'clearing' && "text-orange-700",
                      event.smart_insight.icon === 'fast' && "text-emerald-700",
                      event.smart_insight.icon === 'rising' && "text-amber-700",
                      event.smart_insight.icon === 'stable' && "text-slate-600",
                    )}>
                      {event.smart_insight.verdict}
                    </span>
                    <p className="text-sm font-bold text-slate-500 leading-tight">
                      {event.smart_insight.detail}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Background Decor Layer */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-transparent rounded-bl-[100px] pointer-events-none opacity-40 group-hover:bg-indigo-50/30 transition-all" />
      </div>
    </Link>
  );
}
