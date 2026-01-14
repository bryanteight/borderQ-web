"use client";

import { useState } from "react";
import { Shuffle } from "lucide-react";

interface PortData {
    id: string;
    name: string;
    slug: string;
    subtitle: string;
    color: string;
    line_style: string;
    hourly: { hour: number; wait: number }[];
    peak_hour: number;
    peak_wait: number;
    best_hour: number;
    best_wait: number;
}

interface ComparisonData {
    day: string;
    direction: string;
    ports: PortData[];
    best_overall: { port: string; hour: number; wait: number };
    methodology: string;
}

interface ComparisonChartProps {
    data: ComparisonData;
}

export function ComparisonChart({ data }: ComparisonChartProps) {
    const [hoveredPoint, setHoveredPoint] = useState<{ port: string; hour: number; wait: number } | null>(null);

    if (!data?.ports?.length) return null;

    // Chart dimensions
    const svgWidth = 600;
    const svgHeight = 300;
    const padding = { top: 20, bottom: 50, left: 40, right: 20 };
    const chartWidth = svgWidth - padding.left - padding.right;
    const chartHeight = svgHeight - padding.top - padding.bottom;

    // Filter to active hours (10am - 10pm = hours 10-22)
    const activeHours = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
    const numPoints = activeHours.length;

    // Get max wait across all ports for scaling
    const allWaits = data.ports.flatMap(p =>
        p.hourly.filter(h => activeHours.includes(h.hour)).map(h => h.wait)
    );
    const maxWait = Math.max(...allWaits, 40); // Minimum 40 for scale
    const yTicks = [0, 20, 40, 60, 80].filter(t => t <= maxWait + 10);

    // Scale helpers
    const getX = (hourIndex: number) => padding.left + (hourIndex / (numPoints - 1)) * chartWidth;
    const getY = (wait: number) => padding.top + chartHeight - (wait / maxWait) * chartHeight;

    // Generate smooth curve path
    const getCurvePath = (points: { x: number; y: number }[]) => {
        if (points.length < 2) return "";
        let path = `M ${points[0].x},${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            const cp1x = p0.x + (p1.x - p0.x) / 3;
            const cp2x = p0.x + 2 * (p1.x - p0.x) / 3;
            path += ` C ${cp1x},${p0.y} ${cp2x},${p1.y} ${p1.x},${p1.y}`;
        }
        return path;
    };

    // Format hour for display
    const formatHour = (hour: number) => {
        if (hour === 0) return "12am";
        if (hour === 12) return "12pm";
        return hour < 12 ? `${hour}am` : `${hour - 12}pm`;
    };

    return (
        <div className="bg-slate-900 rounded-2xl p-6 shadow-xl">
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
                <Shuffle className="w-5 h-5 text-slate-400" />
                <h3 className="text-lg font-bold text-white">Compare Ports</h3>
            </div>
            <p className="text-sm text-slate-400 mb-6">
                Find the fastest route between I-5 and Guide Meridian
            </p>

            {/* SVG Chart */}
            <div className="relative">
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
                    {/* Grid Lines */}
                    {yTicks.map((tick) => {
                        const y = getY(tick);
                        return (
                            <g key={tick}>
                                <line
                                    x1={padding.left}
                                    y1={y}
                                    x2={svgWidth - padding.right}
                                    y2={y}
                                    stroke="#334155"
                                    strokeWidth="1"
                                />
                                <text
                                    x={padding.left - 8}
                                    y={y + 4}
                                    textAnchor="end"
                                    fontSize="11"
                                    fill="#64748b"
                                >
                                    {tick}
                                </text>
                            </g>
                        );
                    })}

                    {/* X-Axis Labels */}
                    {activeHours.map((hour, i) => (
                        <text
                            key={hour}
                            x={getX(i)}
                            y={svgHeight - 10}
                            textAnchor="middle"
                            fontSize="11"
                            fill="#94a3b8"
                            className={i % 2 === 0 ? "" : "hidden sm:block"}
                        >
                            {formatHour(hour)}
                        </text>
                    ))}

                    {/* Port Lines */}
                    {data.ports.map((port) => {
                        const points = activeHours.map((hour, i) => {
                            const hourData = port.hourly.find(h => h.hour === hour);
                            return {
                                x: getX(i),
                                y: getY(hourData?.wait ?? 0),
                                wait: hourData?.wait ?? 0,
                                hour
                            };
                        });
                        const path = getCurvePath(points);

                        return (
                            <g key={port.id}>
                                {/* Line */}
                                <path
                                    d={path}
                                    fill="none"
                                    stroke={port.color}
                                    strokeWidth={port.id === "02300402" ? 3 : 2} // Peace Arch thicker
                                    strokeDasharray={port.line_style === "dashed" ? "8 4" : undefined}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* Data Points */}
                                {points.map((p, i) => (
                                    <circle
                                        key={i}
                                        cx={p.x}
                                        cy={p.y}
                                        r={4}
                                        fill={port.color}
                                        stroke="#1e293b"
                                        strokeWidth={2}
                                        className="cursor-pointer hover:r-6 transition-all"
                                        onMouseEnter={() => setHoveredPoint({
                                            port: port.name.replace(" (Southbound)", "").replace(" / Douglas", ""),
                                            hour: p.hour,
                                            wait: p.wait
                                        })}
                                        onMouseLeave={() => setHoveredPoint(null)}
                                    />
                                ))}
                            </g>
                        );
                    })}
                </svg>

                {/* Tooltip */}
                {hoveredPoint && (
                    <div className="absolute top-4 right-4 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm shadow-lg">
                        <div className="font-bold text-white">{hoveredPoint.port}</div>
                        <div className="text-slate-400">
                            {formatHour(hoveredPoint.hour)}: <span className="text-white font-bold">{hoveredPoint.wait} min</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                {data.ports.map((port) => (
                    <div
                        key={port.id}
                        className="bg-slate-800/50 rounded-lg p-3 border-l-4"
                        style={{ borderLeftColor: port.color }}
                    >
                        <div className="text-white font-bold text-sm">
                            {port.name.replace(" (Southbound)", "").replace(" / Douglas", "").replace(" / Aldergrove", "")}
                        </div>
                        <div className="text-slate-400 text-xs">{port.subtitle}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
