import Link from "next/link";
import { BorderEvent } from "@/lib/types";
import { TrendingDown, TrendingUp, Minus, Activity, Car, Zap, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

export function StatusCard({ event }: { event: BorderEvent }) {
  const isClosed = event.status === "Closed";

  // Traffic Color Logic
  const trafficColor = isClosed
    ? "text-gray-300"
    : event.wait_time_minutes > 45
      ? "text-red-500"
      : event.wait_time_minutes > 20
        ? "text-amber-500"
        : "text-emerald-500";

  const cardStyle = "bg-white rounded-[32px] shadow-[0_2px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 border border-slate-200 hover:border-indigo-100 cursor-pointer group";

  // Navigation details
  // Clean slug: "Peace Arch" for Southbound, "Peace Arch" with query for Northbound
  const baseSlug = event.crossing_name.replace(/\s*\(Northbound\)/i, '').replace(/\s*\(Southbound\)/i, '').toLowerCase().replace(/\s+/g, '-');
  const isNorthbound = event.crossing_name.toLowerCase().includes('northbound');

  const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const href = `/stats/${baseSlug}/${dayName}${isNorthbound ? '?direction=north' : ''}`;

  return (
    <Link href={href} className="block h-full group">
      <div className={clsx("relative h-full p-6 md:p-8 flex flex-col", cardStyle)}>
        {/* Header Section: Title Left, Badges Right */}
        <div className="flex justify-between items-start gap-4 mb-6">
          <div className="flex flex-col gap-1">
            <h3 className={clsx(
              "font-[900] text-[#0f172a] tracking-tight group-hover:text-indigo-600 transition-colors leading-tight flex items-end min-h-[3.5rem] md:min-h-[4rem]",
              event.crossing_name.length > 12 ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"
            )}>
              {event.crossing_name.replace(/\s*\(Northbound\)/i, '').replace(/\s*\(Southbound\)/i, '')}
            </h3>

            {!isClosed && (
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

          {/* Right Column: Badges */}
          <div className="flex flex-col items-end gap-2">
            {/* Lanes Open Badge */}
            {!isClosed && event.standard_lanes_open !== undefined && event.standard_lanes_open !== null && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-tight rounded-full shadow-lg shadow-emerald-100 transition-transform active:scale-95 whitespace-nowrap">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                {event.standard_lanes_open} {event.standard_lanes_open === 1 ? "Lane" : "Lanes"}
              </span>
            )}


          </div>
        </div>

        {/* Hero Wait Time Row */}
        <div className="flex items-end gap-3 mb-8 relative">
          {/* Large Current Wait */}
          <div className="flex items-baseline gap-1">
            <span className={clsx(
              "text-6xl md:text-7xl font-[900] tracking-tighter leading-none transition-colors duration-500",
              trafficColor
            )}>
              {event.wait_time_minutes}
            </span>
            <span className="text-lg md:text-xl font-black text-slate-300 transform -translate-y-1">min</span>
          </div>

          {!isClosed && (
            <>
              {/* Vertical Divider (Conditionally visible if typical exists, OR always for badges) */}
              <div className="h-10 w-px bg-slate-100 rounded-full mx-1 hidden sm:block" />

              <div className="flex items-end gap-2.5 pb-1">

                {/* Typical Wait (Only if data exists) */}
                {event.official_avg_minutes !== undefined && event.official_avg_minutes !== null && event.official_avg_minutes > 0 ? (
                  <div className="flex flex-col min-w-[50px]">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5 leading-none">Typical</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-2xl md:text-3xl font-[900] text-slate-400/80 tracking-tight leading-none">
                        {event.official_avg_minutes}
                      </span>
                      <span className="text-xs font-black text-slate-300">min</span>
                    </div>
                  </div>
                ) : (
                  // Placeholder for missing Typical (Northbound)
                  <div className="flex flex-col min-w-[50px] opacity-0 md:opacity-100">
                    {/* Hidden on mobile to save space, visible placeholder on desktop for alignment? 
                          Actually let's just hide typical if missing but keep the PAX badge. 
                      */}
                  </div>
                )}

                {/* PAX Badge (Always Show) */}
                <div className="flex items-center gap-1 bg-slate-50 text-slate-400 px-2.5 py-1 rounded-full text-[9px] uppercase font-black tracking-widest border border-slate-100/60 shadow-sm mb-0.5 transform -translate-y-1">
                  <Car className="w-3 h-3 opacity-70" />
                  <span className="opacity-90">PAX</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer: Smart Insight OR Gathering Data Placeholder */}
        {!isClosed && (
          event.smart_insight ? (
            <div className="pt-6 mt-auto border-t border-slate-50 flex flex-col gap-3 group-hover:border-indigo-100 transition-colors">
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-[900] text-slate-400 uppercase tracking-widest">
                  Next Hour Forecast
                </span>
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
              </div>
            </div>
          ) : (
            // Placeholder for missing Insight (Northbound Learning Phase)
            <div className="pt-6 mt-auto border-t border-slate-50 flex flex-col gap-3 group-hover:border-indigo-100 transition-colors opacity-70">
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-[900] text-slate-400 uppercase tracking-widest">
                  Next Hour Forecast
                </span>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl border border-slate-100 bg-slate-50/50 shadow-sm">
                    <Activity className="w-5 h-5 text-slate-300" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-[900] uppercase tracking-wide text-slate-400">
                      Gathering Data
                    </span>
                    <p className="text-sm font-bold text-slate-400 leading-tight">
                      Learning patterns...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        {/* Background Decor Layer */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-transparent rounded-bl-[100px] pointer-events-none opacity-40 group-hover:bg-indigo-50/30 transition-all" />
      </div>
    </Link>
  );
}
