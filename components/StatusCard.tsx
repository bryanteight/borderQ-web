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
        {/* Header Section: Title Left, Badges Right */}
        <div className="flex justify-between items-start gap-4 mb-6">
          <div className="flex flex-col gap-1">
            <h3 className={clsx(
              "font-[900] text-[#0f172a] tracking-tight group-hover:text-indigo-600 transition-colors leading-tight flex items-end min-h-[3.5rem] md:min-h-[4rem]",
              event.crossing_name.length > 12 ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"
            )}>
              {event.crossing_name}
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

            {/* Hybrid Badge */}
            {!isClosed && event.source_note && (
              <div className="relative group/source">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white text-[9px] font-black uppercase tracking-tight rounded-xl shadow-lg shadow-indigo-200/50 transition-transform hover:scale-105 active:scale-95 cursor-help whitespace-nowrap">
                  <Zap className="w-3 h-3 fill-current" />
                  Hybrid: CBP + DriveBC
                </span>

                {/* Tooltip (Desktop Only) */}
                <div className="hidden md:block absolute top-full right-0 mt-3 w-64 p-3 bg-slate-900/95 backdrop-blur-md shadow-2xl text-white text-[11px] leading-relaxed rounded-2xl opacity-0 group-hover/source:opacity-100 transition-all pointer-events-none z-50 border border-white/10 text-left">
                  <div className="font-black mb-1 text-indigo-300 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    Data Source Fusion
                  </div>
                  {event.source_note}
                  <div className="absolute bottom-full right-4 -mb-1 border-4 border-transparent border-b-slate-900" />
                </div>
              </div>
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
              {/* Vertical Divider */}
              <div className="h-10 w-px bg-slate-100 rounded-full mx-1 hidden sm:block" />

              {/* Typical Wait and PAX Badge */}
              <div className="flex items-end gap-2.5 pb-1">
                <div className="flex flex-col min-w-[50px]">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5 leading-none">Typical</span>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-2xl md:text-3xl font-[900] text-slate-400/80 tracking-tight leading-none">
                      {event.official_avg_minutes || 0}
                    </span>
                    <span className="text-xs font-black text-slate-300">min</span>
                  </div>
                </div>

                {/* PAX Badge */}
                <div className="flex items-center gap-1 bg-slate-50 text-slate-400 px-2.5 py-1 rounded-full text-[9px] uppercase font-black tracking-widest border border-slate-100/60 shadow-sm mb-0.5">
                  <Car className="w-3 h-3 opacity-70" />
                  <span className="opacity-90">PAX</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer: Smart Insight Section */}
        <div className="pt-6 mt-auto border-t border-slate-50 flex flex-col gap-4 group-hover:border-indigo-100 transition-colors">
          <div className="flex items-center justify-between">
            {event.smart_insight && (
              <div className="flex items-center gap-2 bg-slate-50/50 px-2.5 py-1.5 rounded-full border border-slate-100 shadow-sm backdrop-blur-[2px]">
                <div className={clsx(
                  "flex items-center justify-center rounded-full",
                  event.smart_insight.icon === 'surge' && "text-red-600",
                  event.smart_insight.icon === 'clearing' && "text-orange-600",
                  event.smart_insight.icon === 'fast' && "text-emerald-600",
                  event.smart_insight.icon === 'rising' && "text-amber-600",
                  event.smart_insight.icon === 'stable' && "text-slate-400",
                )}>
                  {event.smart_insight.icon === 'surge' && <Activity className="w-3.5 h-3.5" />}
                  {event.smart_insight.icon === 'clearing' && <TrendingDown className="w-3.5 h-3.5" />}
                  {event.smart_insight.icon === 'fast' && <Zap className="w-3.5 h-3.5" />}
                  {event.smart_insight.icon === 'rising' && <TrendingUp className="w-3.5 h-3.5" />}
                  {event.smart_insight.icon === 'stable' && <Minus className="w-3.5 h-3.5" />}
                </div>
                <span className="text-[10px] font-[800] uppercase tracking-wide text-slate-600">
                  {event.smart_insight.verdict}
                </span>
              </div>
            )}


          </div>

          <p className="text-[13px] leading-relaxed font-bold text-slate-500 mb-1 whitespace-normal pl-1">
            {event.smart_insight?.detail || "Steady conditions expected."}
          </p>
        </div>

        {/* Background Decor Layer */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-transparent rounded-bl-[100px] pointer-events-none opacity-40 group-hover:bg-indigo-50/30 transition-all" />
      </div>
    </Link>
  );
}
