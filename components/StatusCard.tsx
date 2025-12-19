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

  const cardStyle = "bg-white rounded-[32px] shadow-[0_2px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 border border-transparent hover:border-indigo-50 cursor-pointer group";

  // Navigation details
  const slug = event.crossing_name.toLowerCase().replace(/\s+/g, '-');
  const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <Link href={`/stats/${slug}/${dayName}`} className="block h-full">
      <div className={clsx("relative h-full p-6 md:p-8 flex flex-col", cardStyle)}>

        {/* Header Right Badges (Static Indicator) */}
        <div className="absolute top-6 right-6 md:top-8 md:right-8">
          <div className="flex items-center gap-1.5 bg-slate-50 text-slate-400 px-2.5 py-1 rounded-lg text-[10px] uppercase font-black tracking-widest border border-slate-100/50">
            <Car className="w-3.5 h-3.5" />
            <span>Passenger</span>
          </div>
        </div>

        {/* Title & Status Badges */}
        <div className="flex flex-col gap-3.5 mb-8">
          <h3 className="text-2xl md:text-3xl font-[900] text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
            {event.crossing_name}
          </h3>

          {!isClosed && (
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Force "Current Wait" label visibility */}
              <span className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mr-1">Current Wait</span>

              {/* Hybrid Badge: Solid High-Contrast */}
              {event.source_note && (
                <div className="relative group/source">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-tight rounded-xl shadow-lg shadow-indigo-200 transition-transform hover:scale-105 active:scale-95 cursor-help">
                    <Zap className="w-3 h-3 fill-current" />
                    Hybrid: CBP + DriveBC
                  </span>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-0 mb-3 w-64 p-3 bg-slate-900/95 backdrop-blur-md shadow-2xl text-white text-[11px] leading-relaxed rounded-2xl opacity-0 group-hover/source:opacity-100 transition-all pointer-events-none z-50 border border-white/10 text-center md:text-left">
                    <div className="font-black mb-1 text-indigo-300 flex items-center gap-1.5 justify-center md:justify-start">
                      <Activity className="w-3.5 h-3.5" />
                      Data Source Fusion
                    </div>
                    {event.source_note}
                    <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-slate-900" />
                  </div>
                </div>
              )}

              {/* Lanes Badge: Solid High-Contrast */}
              {event.standard_lanes_open !== undefined && event.standard_lanes_open !== null && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-tight rounded-xl shadow-lg shadow-emerald-200 transition-transform hover:scale-105 active:scale-95">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  {event.standard_lanes_open} {event.standard_lanes_open === 1 ? "Lane" : "Lanes"} Open
                </span>
              )}
            </div>
          )}
          {isClosed && <span className="text-red-500 font-[900] text-sm uppercase tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            Currently Closed
          </span>}
        </div>

        {/* Hero Wait Time Row */}
        <div className="flex items-end gap-6 mb-8 relative">
          <div className="flex items-baseline gap-2">
            <div className={clsx(
              "text-7xl md:text-8xl font-[900] tracking-tighter leading-none transition-colors duration-500",
              trafficColor
            )}>
              {event.wait_time_minutes}
            </div>
            <div className="text-2xl font-black text-slate-300 transform -translate-y-1">min</div>
          </div>

          {!isClosed && event.official_avg_minutes !== undefined && event.official_avg_minutes !== null && (
            <>
              <div className="h-12 w-0.5 bg-slate-100 rounded-full mx-1 md:mx-2 hidden sm:block" />
              <div className="flex flex-col pb-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Typical</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-[900] text-slate-400/80 tracking-tight">
                    {event.official_avg_minutes}
                  </span>
                  <span className="text-sm font-black text-slate-300">min</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer: Smart Insight Section */}
        <div className="pt-6 mt-auto border-t border-slate-50 flex items-start justify-between group-hover:border-indigo-100 transition-colors">
          <div className="flex flex-col gap-2 flex-1 min-w-0 pr-4">
            {event.smart_insight ? (
              <>
                <div className="flex items-center gap-2.5">
                  <div className={clsx(
                    "p-1.5 rounded-lg shadow-sm",
                    event.smart_insight.icon === 'surge' && "bg-red-50 text-red-600 shadow-red-100",
                    event.smart_insight.icon === 'clearing' && "bg-orange-50 text-orange-600 shadow-orange-100",
                    event.smart_insight.icon === 'fast' && "bg-emerald-50 text-emerald-700 shadow-emerald-100",
                    event.smart_insight.icon === 'rising' && "bg-amber-50 text-amber-600 shadow-amber-100",
                    event.smart_insight.icon === 'stable' && "bg-slate-50 text-slate-500 shadow-slate-100",
                  )}>
                    {event.smart_insight.icon === 'surge' && <Activity className="w-4 h-4" />}
                    {event.smart_insight.icon === 'clearing' && <TrendingDown className="w-4 h-4" />}
                    {event.smart_insight.icon === 'fast' && <Zap className="w-4 h-4" />}
                    {event.smart_insight.icon === 'rising' && <TrendingUp className="w-4 h-4" />}
                    {event.smart_insight.icon === 'stable' && <Minus className="w-4 h-4" />}
                  </div>
                  <span className={clsx(
                    "text-[13px] font-black uppercase tracking-tight",
                    event.smart_insight.icon === 'surge' && "text-red-700",
                    event.smart_insight.icon === 'clearing' && "text-orange-700",
                    event.smart_insight.icon === 'fast' && "text-emerald-700",
                    event.smart_insight.icon === 'rising' && "text-amber-700",
                    event.smart_insight.icon === 'stable' && "text-slate-600",
                  )}>
                    {event.smart_insight.verdict}
                  </span>
                </div>
                <p className="text-[13px] leading-snug font-bold text-slate-600 mt-1 whitespace-normal">
                  {event.smart_insight.detail}
                </p>
              </>
            ) : (
              <div className="flex items-center gap-2 text-slate-400 italic">
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-sm font-medium">Steady conditions expected.</span>
              </div>
            )}
          </div>

          {/* Activity State (Freshness) */}
          <div className="flex flex-col items-end shrink-0 ml-4">
            {event.last_sync && (
              <span className="text-[9px] font-black text-slate-400 tabular-nums whitespace-nowrap bg-slate-50 px-2 py-1 rounded-md border border-slate-100 shadow-sm mb-2">
                {(() => {
                  const diff = Math.floor((new Date().getTime() - new Date(event.last_sync).getTime()) / 60000);
                  if (diff <= 0) return "SYNCED JUST NOW";
                  if (diff === 1) return "1 MIN AGO";
                  return `${diff} MINS AGO`;
                })()}
              </span>
            )}
            <div className="flex items-center gap-1.5 text-indigo-600 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
              Details <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Background Decor Layer */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-transparent rounded-bl-[100px] pointer-events-none opacity-40 group-hover:bg-indigo-50/30 transition-all" />
      </div>
    </Link>
  );
}
