"use client";

import { useState } from "react";
import { BorderEvent } from "@/lib/types";
import { TrendingDown, TrendingUp, Minus, Activity, Car, Zap, ChevronRight, Octagon, CornerUpRight } from "lucide-react";
import { clsx } from "clsx";
import { ForecastTeaser } from "./ForecastTeaser";
import { CameraModal } from "./CameraModal";
import { CameraThumbnail } from "./CameraThumbnail";
import { Tooltip } from "./Tooltip";
import { getSlugFromEvent, isEventClosed } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function StatusCard({ event }: { event: BorderEvent }) {
  const t = useTranslations('StatusCard');
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

  // Use real data
  const smartAnalysis = event.smart_analysis;

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
            {/* Official Estimate Label OR Nowcast Recommendation */}
            {!isClosed && !isNoData && (
              <div className="mt-2 text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-1">
                {event.recommendation ? (
                  // [NEW] Action-Oriented Pulse Chip
                  <div className={clsx(
                    "flex items-center gap-1.5 px-2 py-1 rounded-md text-white shadow-sm animate-in fade-in zoom-in duration-300",
                    event.recommendation.action === 'GO_NOW' && "bg-gradient-to-r from-violet-600 to-indigo-600 ring-1 ring-white/20",
                    event.recommendation.action === 'HOLD' && "bg-gradient-to-r from-red-500 to-orange-500 ring-1 ring-white/20",
                    event.recommendation.action === 'DETOUR' && "bg-gradient-to-r from-blue-600 to-cyan-600 ring-1 ring-white/20"
                  )}>
                    {event.recommendation.action === 'GO_NOW' && <Zap className="w-3 h-3 fill-white animate-pulse" />}
                    {event.recommendation.action === 'HOLD' && <Octagon className="w-3 h-3 fill-white" />}
                    {event.recommendation.action === 'DETOUR' && <CornerUpRight className="w-3 h-3" />}

                    <span className="tracking-wide">{event.recommendation.title}</span>
                    <Tooltip
                      id="rec-tooltip"
                      align="left"
                      content={event.recommendation.description}
                    />
                  </div>
                ) : (
                  // Default Label
                  <span className="text-[#94a3b8] flex items-center gap-1">
                    {t('officialEstimate')}
                    <Tooltip id="wait-time" align="left" content={t('officialEstimateTooltip')} />
                  </span>
                )}
              </div>
            )}
            {isClosed && (
              <span className="text-red-500 font-[900] text-xs uppercase tracking-widest flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {t('closed')}
              </span>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            {!isClosed && event.standard_lanes_open !== undefined && event.standard_lanes_open !== null && (
              <div className="flex items-center gap-1">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-tight rounded-full shadow-lg shadow-emerald-100 transition-transform active:scale-95 whitespace-nowrap">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  {event.standard_lanes_open} {event.standard_lanes_open === 1 ? t('lane') : t('lanes')}
                </span>
                <Tooltip id="lane-count" align="right" side="bottom" content={t('openLanesTooltip')} />
              </div>
            )}

            {/* View Details Link - DEV ONLY */}
            {process.env.NODE_ENV === 'development' && (
              <div className="flex items-center gap-0.5 text-[10px] font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-all ml-auto mt-1">
                <span>{t('seeDetails')}</span>
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
                  {t('noData')}
                </span>
              ) : (
                <>
                  <span className={clsx(
                    "text-6xl md:text-7xl font-[900] tracking-tighter leading-none transition-colors duration-500",
                    trafficColor
                  )}>
                    {event.wait_time_minutes}
                  </span>
                  <span className="text-lg md:text-xl font-black text-slate-300 transform -translate-y-1">{t('min')}</span>
                </>
              )}
            </div>

            {/* Typical Time Row */}
            {!isClosed && !isNoData && event.official_avg_minutes !== undefined && event.official_avg_minutes !== null && event.official_avg_minutes > 0 && (
              <div className="flex items-baseline gap-1.5 mt-1 ml-1">
                <span className="text-[11px] font-bold text-slate-400">{t('typical')}</span>
                <span className="text-xl font-[900] text-slate-400/80 tracking-tight leading-none">
                  {event.official_avg_minutes}
                </span>
                <span className="text-[10px] font-bold text-slate-300">{t('min')}</span>
              </div>
            )}
          </div>

          {/* Right: Camera Thumbnail + AI Insight */}
          <div className="flex-1 max-w-[50%] flex flex-col items-end gap-1.5">
            <CameraThumbnail
              crossingId={event.id}
              crossingName={event.crossing_name}
              hasCameras={event.has_cameras || false}
              onOpen={() => setIsCameraModalOpen(true)}
              className="w-full aspect-video max-w-[180px] h-auto shadow-sm"
            />

            {/* Camera AI Insight (Vision Enrichment) */}
            {event.camera_insight && (
              <button
                onClick={(e) => { e.stopPropagation(); setIsCameraModalOpen(true); }}
                className={clsx(
                  "w-full max-w-[180px] text-left px-2.5 py-1.5 rounded-lg border transition-all duration-200 group/insight",
                  "hover:shadow-sm active:scale-[0.98]",
                  event.camera_insight.severity === 'busy' && "bg-red-50 border-red-100 hover:border-red-200",
                  event.camera_insight.severity === 'warning' && "bg-amber-50 border-amber-100 hover:border-amber-200",
                  event.camera_insight.severity === 'clear' && "bg-emerald-50 border-emerald-100 hover:border-emerald-200",
                  event.camera_insight.severity === 'info' && "bg-blue-50 border-blue-100 hover:border-blue-200",
                  event.camera_insight.severity === 'normal' && "bg-slate-50 border-slate-100 hover:border-slate-200",
                )}
              >
                <p className={clsx(
                  "text-[10px] font-bold leading-tight",
                  event.camera_insight.severity === 'busy' && "text-red-700",
                  event.camera_insight.severity === 'warning' && "text-amber-700",
                  event.camera_insight.severity === 'clear' && "text-emerald-700",
                  event.camera_insight.severity === 'info' && "text-blue-700",
                  event.camera_insight.severity === 'normal' && "text-slate-600",
                )}>
                  {event.camera_insight.verdict}
                </p>
                <p className="text-[9px] text-slate-400 mt-0.5 leading-tight group-hover/insight:text-slate-500 transition-colors">
                  {event.camera_insight.detail}
                </p>
              </button>
            )}
          </div>
        </div>

        {/* Smart Analysis (AI Insight) */}
        {smartAnalysis && (
          <div className="mt-4 pt-3 border-t border-indigo-50 relative z-10">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-indigo-50 rounded-lg shrink-0 mt-0.5 shadow-sm ring-1 ring-indigo-100">
                <Activity className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                  {t('aiLiveAnalysis')}
                </p>
                <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                  {smartAnalysis}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Forecast Footer */}
        {!isClosed && !isNoData && event.forecast_points && event.forecast_points.length > 1 && (
          <div className="pt-3 mt-auto border-t border-slate-50 flex flex-col gap-3 group-hover:border-indigo-100 transition-colors relative">
            {/* Forecast Teaser (conditionally rendered) */}
            {!isClosed && !isNoData && (
              <div className="mt-4 pb-2">
                <ForecastTeaser
                  currentWait={event.wait_time_minutes}
                  forecastPoints={event.forecast_points}
                  labels={event.timeline_labels}
                />
              </div>
            )}</div>
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
