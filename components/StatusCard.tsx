"use client";

import { useState } from "react";
import { BorderEvent } from "@/lib/types";
import { TrendingDown, TrendingUp, Minus, Activity, Car, Zap, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import { ForecastTeaser } from "./ForecastTeaser";
import { CameraModal } from "./CameraModal";
import { CameraThumbnail } from "./CameraThumbnail"; // New Import
import { getSlugFromEvent, isEventClosed } from "@/lib/utils";

export function StatusCard({ event }: { event: BorderEvent }) {
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
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

  const isDev = process.env.NODE_ENV === 'development';
  const cardStyle = clsx(
    "bg-white rounded-[32px] shadow-[0_2px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 border border-slate-200 hover:border-indigo-100 group select-none",
    isDev ? "cursor-pointer" : "cursor-default"
  );

  // Navigation details
  const baseSlug = getSlugFromEvent(event);
  const isNorthbound = event.id.startsWith("NB_");

  const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const href = `/stats/${baseSlug}/${dayName}${isNorthbound ? '?direction=north' : ''}`;

  return (
    <>
      <div
        className={clsx("relative h-full p-6 md:p-8 flex flex-col", cardStyle)}
        onClick={() => {
          if (isDev) window.location.href = href;
        }}
      >
        {/* Header Section: Title Left, Badges Right */}
        <div className="flex justify-between items-start gap-4 mb-2">
          <div className="flex flex-col gap-1">
            {/* Title */}
            {(() => {
              const displayName = event.crossing_name.replace(/\s*\(Northbound\)/i, '').replace(/\s*\(Southbound\)/i, '');
              const isLongName = displayName.length > 16;

              return (
                <h3 className={clsx(
                  "font-[900] text-[#0f172a] tracking-tight group-hover:text-indigo-600 transition-colors leading-tight flex items-end min-h-[3rem]",
                  isLongName ? "text-lg md:text-2xl" : "text-2xl md:text-3xl"
                )}>
                  {displayName}
                </h3>
              );
            })()}

            {/* Official Estimate Label */}
            {!isClosed && !isNoData && (
              <span className="text-[#94a3b8] font-black text-[10px] uppercase tracking-[0.1em] whitespace-nowrap mt-2">
                OFFICIAL ESTIMATE
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

            {/* View Details Link - DEV ONLY */}
            {process.env.NODE_ENV === 'development' && (
              <div className="flex items-center gap-0.5 text-[10px] font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-all ml-auto mt-1">
                <span>See details</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            )}
          </div>
        </div>

        {/* Wait Time & Thumbnail Row */}
        <div className="flex items-center justify-between gap-2 mb-6 relative min-h-[112px]"> {/* Fixed height for consistency */}

          {/* Left: Wait Time Info */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              {isNoData ? (
                <span className="text-3xl md:text-4xl font-[900] tracking-tight leading-none text-gray-300">
                  No data
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

            {/* Typical Time Row */}
            {!isClosed && !isNoData && event.official_avg_minutes !== undefined && event.official_avg_minutes !== null && event.official_avg_minutes > 0 && (
              <div className="flex items-baseline gap-1.5 mt-1 ml-1">
                <span className="text-[11px] font-bold text-slate-400">Typical</span>
                <span className="text-xl font-[900] text-slate-400/80 tracking-tight leading-none">
                  {event.official_avg_minutes}
                </span>
                <span className="text-[10px] font-bold text-slate-300">min</span>
              </div>
            )}
          </div>

          {/* Right: Camera Thumbnail */}
          <div className="flex-1 max-w-[50%] flex justify-end">
            <CameraThumbnail
              crossingId={event.id}
              crossingName={event.crossing_name}
              hasCameras={event.has_cameras || false}
              onOpen={() => setIsCameraModalOpen(true)}
              className="w-full aspect-video max-w-[180px] h-auto shadow-sm"
            />
          </div>
        </div>

        {/* Footer: Smart Insight Only (Camera Button Removed) */}
        {!isClosed && !isNoData && event.forecast_points && event.forecast_points.length > 1 && (
          <div className="pt-3 mt-auto border-t border-slate-50 flex flex-col gap-3 group-hover:border-indigo-100 transition-colors relative">
            <div className="flex flex-col gap-3">
              <div className="w-full mt-1">
                <ForecastTeaser currentWait={Math.max(0, event.wait_time_minutes)} forecastPoints={event.forecast_points} />
              </div>
            </div>
          </div>
        )}

        {/* Background Decor Layer */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-transparent rounded-bl-[100px] pointer-events-none opacity-40 group-hover:bg-indigo-50/30 transition-all" />
      </div>

      {/* Camera Modal */}
      <CameraModal
        crossingId={event.id}
        crossingName={event.crossing_name}
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
      />
    </>
  );
}
