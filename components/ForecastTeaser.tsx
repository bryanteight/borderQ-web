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

    const minIndex = forecastPoints.indexOf(minForecast);
    const waitDuration = minIndex * 60;

    // Generate Absolute Time Labels
    const getLabels = () => {
        const now = new Date();
        return forecastPoints.map((_, i) => {
            if (i === 0) return "Now";
            const futureDate = new Date(now.getTime() + i * 60 * 60 * 1000);
            return futureDate.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }).replace(/\s/g, '');
        });
    };
    const absoluteLabels = getLabels();

    // Logic Scenarios

    // Traffic Color Logic for Future Wait
    // Follows same thresholds as StatusCard: >45 (Red), >20 (Amber/Yellow), Else (Green)
    let theme: "red" | "yellow" | "emerald" | "violet" | "gray" = "emerald";

    if (futureWait > 45) {
        theme = "red";
    } else if (futureWait > 20) {
        theme = "yellow";
    } else {
        theme = "emerald";
    }

    // Styles
    const styles = {
        red: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", sub: "text-red-600", chart: "red" },
        yellow: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", sub: "text-amber-600", chart: "yellow" }, // Updated to match amber tone
        emerald: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", sub: "text-emerald-600", chart: "emerald" },
        violet: { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", sub: "text-violet-600", chart: "violet" },
        gray: { bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-700", sub: "text-slate-500", chart: "indigo" },
    };

    const s = styles[theme];

    // Static Label as requested by user
    const labelText = "Next Hour Forecast";

    return (
        <div className={`relative w-full rounded-2xl border ${s.border} ${s.bg} shadow-sm overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer`}>
            {/* Content Layer */}
            <div className="relative z-10 p-4 pb-2 flex justify-between items-center">
                {/* Left: Label */}
                <div className="flex flex-col">
                    <span className={`text-xs font-bold ${s.text}`}>
                        {labelText}
                    </span>
                </div>

                {/* Right: Big Future Number */}
                <div className="flex flex-col items-end">
                    <div className={`text-3xl font-[900] ${s.text} leading-none tracking-tighter`}>
                        {Math.max(0, Math.round(futureWait * 0.9))}~{Math.round(futureWait * 1.1)}<span className="text-sm align-top ml-0.5 opacity-60">m</span>
                    </div>
                </div>
            </div>

            {/* Sparkline Layer (Bottom) */}
            <div className="relative h-14 w-full opacity-90 px-0">
                <SimpleSparkline
                    points={forecastPoints}
                    minimal={true}
                    color={s.chart as any}
                    labels={absoluteLabels}
                />
            </div>
        </div>
    );
}
