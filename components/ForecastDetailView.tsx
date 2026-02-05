'use client';

import { ComparisonForecast } from "@/lib/api";
import { Line, LineChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { ArrowLeft, CheckCircle2, Info, Zap, AlertCircle, Maximize2, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export function ForecastDetailView({ forecast }: { forecast: ComparisonForecast }) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [selectedPort, setSelectedPort] = useState<string | null>(null);

    // 1. Combine 3-port slots into one data array for the chart
    const chartData = Array.from({ length: 96 }, (_, idx) => {
        const h = Math.floor(idx / 4);
        const m = (idx % 4) * 15;
        const timeLabel = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

        const dataPoint: any = { time: timeLabel };

        // Map individual port values to the data point
        Object.values(forecast.ports).forEach(port => {
            dataPoint[port.slug] = port.forecast_96_slots[idx];

            // Add Range [Min, Max] for Area Chart with Safety Fallback
            const min = port.forecast_96_ranges_min ? port.forecast_96_ranges_min[idx] : port.forecast_96_slots[idx];
            const max = port.forecast_96_ranges_max ? port.forecast_96_ranges_max[idx] : port.forecast_96_slots[idx];

            dataPoint[`${port.slug}_range`] = [min, max];
        });

        return dataPoint;
    });

    const dateObj = new Date(forecast.date + 'T12:00:00');

    // COLORS for ports (High Contrast: Emerald, Indigo, Amber)
    const colors: Record<string, string> = {
        "peace-arch": "#10b981",     // Emerald 500
        "peace-arch-nb": "#10b981",
        "pacific-highway": "#6366f1", // Indigo 500
        "pacific-highway-nb": "#6366f1",
        "lynden": "#f59e0b",          // Amber 500
        "lynden-nb": "#f59e0b"
    };

    return (
        <div className="min-h-screen bg-[#F6F8FA] p-4 md:p-8 font-sans">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-8">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors group">
                    <div className="bg-white p-2 rounded-full border border-slate-200 group-hover:border-slate-300 shadow-sm">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm">Back to Dashboard</span>
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-[900] uppercase tracking-wider">
                                Regional AI Comparison
                            </span>
                            {forecast.is_holiday && (
                                <span className="px-2.5 py-1 rounded-md bg-rose-100 text-rose-700 text-[10px] font-[900] uppercase tracking-wider">
                                    {forecast.holiday_name}
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-[900] text-slate-900 tracking-tight mb-2">
                            {forecast.direction === "SOUTHBOUND" ? "Southbound" : "Northbound"} Forecast
                        </h1>
                        <p className="text-xl text-slate-500 font-medium">
                            {dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Confidence Badge */}
                        <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-right">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confidence</span>
                            <span className="text-emerald-600 font-[800] text-sm">High Reliability</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Smart Pick Banner (Concern 2: Decision Making) */}
            <div className="max-w-6xl mx-auto mb-8">
                <div className="bg-white border-2 border-indigo-500 p-6 rounded-[2rem] shadow-xl shadow-indigo-100 flex flex-col md:flex-row items-center gap-6">

                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-indigo-600 font-[900] text-xs uppercase tracking-[0.2em] mb-1">AI Smart Recommendation</h3>
                        <div
                            className="text-slate-900 text-sm md:text-base font-medium leading-relaxed space-y-4"
                            dangerouslySetInnerHTML={{ __html: forecast.smart_pick.html_report || forecast.smart_pick.reason }}
                        />
                    </div>

                </div>
            </div>

            {/* Comparison Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* 1. Comparison Stats (Left) */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
                        <h3 className="text-sm font-[800] text-slate-900 mb-6 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-indigo-500" />
                            Average Wait Focus
                        </h3>

                        <div className="space-y-6">
                            {Object.values(forecast.ports).map((port) => {
                                const avg = Math.round(forecast.smart_pick.average_waits[port.id]);
                                const isBest = forecast.smart_pick.recommended_port_ids.includes(port.id);

                                // Calculate day-wide averages for the range
                                const avgMin = Math.round(port.forecast_96_ranges_min.reduce((a, b) => a + b, 0) / 96);
                                const avgMax = Math.round(port.forecast_96_ranges_max.reduce((a, b) => a + b, 0) / 96);

                                return (
                                    <div key={port.id} className="group">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className={`text-sm font-bold ${isBest ? 'text-slate-900 border-b-2' : 'text-slate-400'}`} style={{ borderColor: isBest ? colors[port.slug] : 'transparent' }}>
                                                {port.name.split('(')[0].replace(" / Douglas", "").replace(" / Aldergrove", "")}
                                            </span>
                                            <div className="text-right">
                                                <div className={`text-xl font-[900] ${isBest ? 'text-slate-900' : 'text-slate-900'}`} style={{ color: isBest ? colors[port.slug] : undefined }}>
                                                    {avg}m
                                                </div>
                                                <div className="text-[10px] font-bold text-slate-400 -mt-1">
                                                    {avgMin}~{avgMax}m
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${isBest ? 'opacity-100' : 'opacity-30 grayscale'}`}
                                                style={{
                                                    width: `${Math.min(100, (avg / 60) * 100)}%`,
                                                    backgroundColor: colors[port.slug]
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-indigo-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[4rem] group-hover:scale-110 transition-transform" />
                        <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-2 font-mono">Expert Tip</h3>
                        <p className="text-sm font-medium leading-relaxed">
                            Pacific Highway (Truck Crossing) often has shorter waits for passenger vehicles during PAX peak hours, even if commercial lines look long.
                        </p>
                    </div>
                </div>

                {/* 2. Main Comparison Chart (span 3) */}
                <div className="lg:col-span-3 bg-white border border-slate-200 p-6 md:p-8 rounded-3xl shadow-sm min-h-[500px] flex flex-col">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-sm font-[800] text-slate-400 uppercase tracking-wider">
                                    24-Hour Comparison
                                </h3>
                                <button
                                    onClick={() => setIsFullscreen(true)}
                                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors md:hidden"
                                >
                                    <Maximize2 className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 font-medium">Historical simulation for {dateObj.toDateString()}</p>
                        </div>
                        <div className="flex flex-wrap gap-4 px-2 py-2 bg-slate-50 rounded-xl">
                            {Object.values(forecast.ports).map(port => (
                                <div key={port.id} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[port.slug] }}></div>
                                    <span className="text-[10px] font-black uppercase text-slate-600 tracking-tighter">{port.name.split(' (')[0]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 w-full h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="time"
                                    tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                                    interval={7}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                                    axisLine={false}
                                    tickLine={false}
                                    unit="m"
                                    dx={-5}
                                />
                                <Tooltip content={<CustomTooltip colors={colors} />} />
                                <Legend wrapperStyle={{ display: 'none' }} />

                                {Object.values(forecast.ports).map(port => {
                                    // Filter Logic
                                    if (selectedPort && selectedPort !== port.slug) return null;

                                    return (
                                        <React.Fragment key={port.id}>
                                            {/* Confidence Band (Area) */}
                                            <Area
                                                key={`${port.id}-area`}
                                                type="monotone"
                                                dataKey={`${port.slug}_range`}
                                                stroke="none"
                                                fill={colors[port.slug]}
                                                fillOpacity={0.15}
                                                animationDuration={1500}
                                            />
                                            {/* Main Trend Line */}
                                            <Line
                                                key={port.id}
                                                type="monotone"
                                                dataKey={port.slug}
                                                name={port.name.split(' (')[0]}
                                                stroke={colors[port.slug]}
                                                strokeWidth={port.slug.includes('peace') ? 3 : 2}
                                                dot={false}
                                                animationDuration={2000}
                                                strokeDasharray={port.slug.includes('lynden') ? "5 5" : "0"}
                                            />
                                        </React.Fragment>
                                    );
                                })}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                        <Info className="w-4 h-4 text-slate-400 mt-0.5" />
                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                            Note: The comparison data is generated using similar historical scenarios (Holidays, Weather, and Day-of-week). Real-time conditions like accidents or inspection surges are not factored into future forecasts.
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter Badges (Interactive Legend) */}
            <div className="max-w-6xl mx-auto mt-8 mb-12 flex justify-center">
                <div className="bg-white px-2 py-2 rounded-full border border-slate-200 flex items-center gap-1 shadow-sm overflow-x-auto">
                    {Object.values(forecast.ports).map(port => {
                        const isSelected = selectedPort === port.slug;
                        const isDimmed = selectedPort && !isSelected;

                        return (
                            <button
                                key={port.id}
                                onClick={() => setSelectedPort(isSelected ? null : port.slug)}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-full transition-all border
                                    ${isSelected ? 'bg-slate-50 border-slate-200 shadow-inner' : 'bg-transparent border-transparent hover:bg-slate-50'}
                                    ${isDimmed ? 'opacity-40 grayscale' : 'opacity-100'}
                                `}
                            >
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: colors[port.slug], boxShadow: `0 0 0 2px ${colors[port.slug]}40` }}
                                />
                                <span className={`text-sm font-bold ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>
                                    {port.name.split(' (')[0].replace(" / Douglas", "")}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
            {/* Fullscreen Overlay (Mobile Landscape Mode) */}
            {isFullscreen && (
                <div className="fixed inset-0 z-50 bg-[#F6F8FA] p-4 flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center mb-4 shrink-0">
                        <h2 className="text-lg font-[900] text-slate-900">Landscape View</h2>
                        <button
                            onClick={() => setIsFullscreen(false)}
                            className="p-2 bg-white rounded-full shadow-lg border border-slate-200"
                        >
                            <X className="w-6 h-6 text-slate-600" />
                        </button>
                    </div>
                    <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="time" />
                                <YAxis unit="m" />
                                <Tooltip content={<CustomTooltip colors={colors} />} />
                                {Object.values(forecast.ports).map(port => {
                                    if (selectedPort && selectedPort !== port.slug) return null;
                                    return (
                                        <React.Fragment key={`${port.id}-fs`}>
                                            <Area
                                                key={`${port.id}-area-fs`}
                                                type="monotone"
                                                dataKey={`${port.slug}_range`}
                                                stroke="none"
                                                fill={colors[port.slug]}
                                                fillOpacity={0.15}
                                            />
                                            <Line
                                                key={port.id}
                                                type="monotone"
                                                dataKey={port.slug}
                                                stroke={colors[port.slug]}
                                                strokeWidth={3}
                                                dot={false}
                                                strokeDasharray={port.slug.includes('lynden') ? "5 5" : "0"}
                                            />
                                        </React.Fragment>
                                    );
                                })}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-center text-slate-400 text-xs mt-4 shrink-0 animate-pulse">
                        Rotate your device for best experience
                    </p>
                </div>
            )}
        </div>
    );
}

function CustomTooltip({ active, payload, label, colors }: any) {
    if (active && payload && payload.length) {
        // payload is array of all lines/areas. 
        // We have duplicates because we have Line + Area for each port.
        // We want to group by port.

        // Extract unique ports from payload
        // payload item structure: { dataKey: 'peace-arch', value: 20, payload: { ...row data... }, name: ... }

        // Strategy: iterate over known ports in the row data, checking if they are present in payload
        const rowData = payload[0].payload;

        // Filter out the "_range" dataKeys from the display list, we just read them from rowData
        // We only want to map over the "primary" keys (e.g. 'peace-arch')
        const visibleItems = payload.filter((p: any) => !p.dataKey.endsWith('_range'));

        return (
            <div className="bg-white p-3 border border-slate-200 rounded-xl shadow-xl min-w-[200px]">
                <p className="font-bold text-slate-400 text-xs mb-3 border-b border-slate-100 pb-2">{label}</p>
                <div className="space-y-2">
                    {visibleItems.map((item: any) => {
                        const portSlug = item.dataKey;
                        const range = rowData[`${portSlug}_range`];
                        const avg = item.value;
                        const color = colors[portSlug] || item.color;
                        const name = item.name;

                        return (
                            <div key={portSlug} className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 0 2px ${color}60` }} />
                                    <span className="text-xs font-bold text-slate-700 uppercase tracking-tighter">{name}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-[900] text-slate-900">{avg}m</span>
                                    {range && (
                                        <span className="text-[10px] text-slate-400 font-mono ml-1.5 opacity-80">
                                            {range[0]}-{range[1]}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
    return null;
}

function convertToAMPM(time24: string) {
    if (!time24) return "";
    const [h, m] = time24.split(':');
    let hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    return `${hour}:${m} ${ampm}`;
}
