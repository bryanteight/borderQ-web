import React from "react";
import { SimpleSparkline } from "./SimpleSparkline";

interface ForecastTeaserProps {
    currentWait: number;
    forecastPoints?: number[];
}

export function ForecastTeaser({ currentWait, forecastPoints }: ForecastTeaserProps) {
    if (!forecastPoints || forecastPoints.length < 2) return null;

    const maxForecast = Math.max(...forecastPoints);
    const minForecast = Math.min(...forecastPoints);
    // [UX FIX] Map display number to +1 Hour prediction (index 1)
    // forecastPoints is [Now, +1h, +2h, +3h]
    const futureWait = forecastPoints[1] || forecastPoints[forecastPoints.length - 1];

    let theme: "red" | "yellow" | "emerald" | "violet" | "gray" = "gray";
    let title = "Normal Traffic";
    let action = "Conditions are stable.";

    // Logic Scenarios

    // 1. Rising Fast (Red)
    if (maxForecast >= currentWait + 10) {
        theme = "red";
        title = "Warning: Traffic Rising!";
        action = "Leave within 15 mins.";
    }
    // 2. Smart Wait (Yellow) - High but dropping
    else if (currentWait > 30 && minForecast <= currentWait - 15) {
        theme = "yellow";
        title = "Wait to Save Time";
        action = `Wait 40 mins to save ${currentWait - minForecast} mins.`;
    }
    // 3. All Clear (Green)
    else if (currentWait < 15) {
        theme = "emerald";
        title = "All Clear";
        action = "Best time to cross.";
    }
    // 4. Detour (Purple) - High and steady (no drop)
    else if (currentWait >= 45) {
        theme = "violet";
        title = "Crossing Stuck";
        action = "Consider alternative routes.";
    }

    // Styles
    const styles = {
        red: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", sub: "text-red-600", chart: "red" },
        yellow: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700", sub: "text-yellow-600", chart: "yellow" },
        emerald: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", sub: "text-emerald-600", chart: "emerald" },
        violet: { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", sub: "text-violet-600", chart: "violet" },
        gray: { bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-700", sub: "text-slate-500", chart: "indigo" },
    };

    const s = styles[theme];

    return (
        <div className={`relative w-full rounded-2xl border ${s.border} ${s.bg} shadow-sm overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer`}>
            {/* Content Layer */}
            <div className="relative z-10 p-4 pb-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className={`text-sm font-bold uppercase tracking-wider ${s.sub}`}>{title}</h3>
                        <p className={`text-lg font-bold leading-tight mt-0.5 ${s.text}`}>
                            {action}
                        </p>
                    </div>
                    <div className="flex flex-col items-end justify-center">
                        <div className={`text-2xl font-[900] ${s.text} opacity-20 leading-none`}>
                            {Math.max(0, Math.round(futureWait * 0.9))}~{Math.round(futureWait * 1.1)}m
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-tighter mt-1 ${s.sub} opacity-40`}>
                            Expected in 60m
                        </span>
                    </div>
                </div>
            </div>

            {/* Sparkline Layer (Bottom) */}
            <div className="relative h-16 w-full -mt-2 opacity-80">
                <SimpleSparkline
                    points={forecastPoints}
                    minimal={true}
                    color={s.chart as any}
                />
            </div>
        </div>
    );
}
