import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, TrendingUp, Navigation, Clock, Car, CloudRain, Sun } from "lucide-react";

// Reusing types from the single port schema for consistency
const PORT_MAP: Record<string, string> = {
    "peace-arch": "02300402",      // ID ending in 402 is Peace Arch
    "pacific-highway": "02300401", // ID ending in 401 is Pacific Hwy
    "lynden": "02302301",
};

const PORT_NAMES: Record<string, string> = {
    "peace-arch": "Peace Arch",
    "pacific-highway": "Pacific Highway",
    "lynden": "Lynden",
};

interface StatsResponse {
    title: string;
    realtime: {
        wait_time: number;
        official_avg_minutes: number;
        weather: string;
        status: string;
    };
    stats: {
        avg_wait: number;
        max_wait: number;
        min_wait: number;
        sample_size: number;
        day: string;
        best_time: string;
        worst_time: string;
        weather_impact_mins: number;
        hourly: { hour: number; wait: number }[];
    };
    context: {
        next_holiday: string | null;
        is_raining: boolean;
    };
    narrative: {
        intro: string;
        savings_analysis: string;
    };
    json_ld: any;
    message?: string;
}

async function getStats(portId: string, day: string): Promise<StatsResponse | null> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const cleanUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const res = await fetch(`${cleanUrl}/api/v1/stats/${portId}/${day}`, { cache: 'no-store' });
        if (!res.ok) {
            console.error("Stats API Error:", res.status);
            return null;
        }
        return res.json();
    } catch (e) {
        console.error("Stats Fetch Error:", e);
        return null;
    }
}

export default async function StatsPage({ params }: { params: Promise<{ port: string, day: string }> }) {
    // Next.js 15+: params is a Promise
    const { port, day } = await params;


    const portId = PORT_MAP[port];

    // Handle invalid port
    // Handle invalid port
    if (!portId) {
        notFound();
    }

    const data = await getStats(portId, day);
    const portName = PORT_NAMES[port] || port;
    const dayName = day.charAt(0).toUpperCase() + day.slice(1);

    // 1. Handle Invalid Page (404 from API)
    if (!data) {
        notFound();
    }

    // 2. Handle Valid Page but No Data (e.g. Future Holiday)
    if (!data.stats || data.message) {
        return (
            <main className="min-h-screen bg-[#F6F8FA] text-slate-900 font-sans p-6">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 font-bold">
                    <ArrowLeft className="w-5 h-5" /> Back
                </Link>
                <div className="max-w-md mx-auto bg-white rounded-[32px] p-8 text-center shadow-sm">
                    <h1 className="text-xl font-[800] text-slate-900 mb-2">Data Generating...</h1>
                    <p className="text-slate-500">
                        We are currently collecting historical data for {portName} on {dayName}s. Please check back later or visit the <Link href="/" className="text-indigo-600 hover:underline">live dashboard</Link>.
                    </p>
                    {data?.message && <p className="text-xs text-red-400 mt-4 font-mono">{data.message}</p>}
                </div>
            </main>
        );
    }

    const { stats, json_ld, realtime, context } = data;

    // Filter to only 6 KEY hours as user requested (not too dense)
    // Key hours: 6am, 9am, 12pm, 3pm, 6pm, 9pm
    const keyHours = [6, 9, 12, 15, 18, 21];
    const hourlyData = stats.hourly || [];
    const chartData = keyHours.map(h => {
        const found = hourlyData.find(x => x.hour === h);
        return found || { hour: h, wait: 0 };
    });

    // Find max for scaling
    const maxWait = Math.max(...chartData.map(h => h.wait), 1);


    // Helper to format chart labels
    const getLabel = (h: number) => {
        if (h === 6) return '6am';
        if (h === 9) return '9am';
        if (h === 12) return '12pm';
        if (h === 15) return '3pm';
        if (h === 18) return '6pm';
        if (h === 21) return '9pm';
        return '';
    };

    return (
        <main className="min-h-screen bg-[#F6F8FA] text-slate-900 pb-20 font-sans">
            {/* JSON-LD injection ... */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(json_ld) }}
            />

            {/* Header ... */}
            {/* Header / Nav */}
            <header className="relative bg-[#F6F8FA] border-b border-white/50 py-4 px-6 mb-6">
                <div className="max-w-md mx-auto flex items-center justify-between">
                    {/* Back to Regional */}
                    <Link href={`/stats/seattle-to-vancouver/${day}`} className="flex items-center gap-2 group">
                        <div className="p-2 rounded-full bg-white shadow-sm border border-slate-100 group-hover:bg-slate-50 transition-colors">
                            <ArrowLeft className="w-4 h-4 text-slate-600" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Back to</span>
                            <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">All Ports ({dayName})</span>
                        </div>
                    </Link>

                    {/* Home Link (Icon) */}

                    {/* Home Link (Text Button) */}
                    <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full transition-colors">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wide">Live Dashboard</span>
                    </Link>
                </div>
            </header>

            <div className="max-w-md mx-auto px-6 space-y-6">
                {/* Title Group */}
                <div className="space-y-2">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
                        {dayName} Analysis
                    </span>
                    <h1 className="text-3xl font-[800] tracking-tight text-slate-900 leading-tight">
                        {portName} Traffic
                    </h1>

                </div>

                {/* 0. Daily Insight (Narrative) - NEW */}
                {/* This adds value beyond the raw numbers below */}
                {data.narrative && (
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-[28px] p-6 relative overflow-hidden">
                        <div className="flex items-start gap-4 relaltive z-10">
                            <div className="p-3 bg-white rounded-xl shadow-sm border border-indigo-50 text-indigo-600">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-sm font-[800] text-indigo-900 uppercase tracking-wide mb-2">Daily Insight</h3>
                                <p className="text-slate-700 leading-relaxed font-medium">
                                    {data.narrative.intro}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 1. Main Insight Card (Split View) */}
                <div className="bg-white rounded-[32px] p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 relative overflow-hidden">
                    <div className="flex gap-8 relative z-10">
                        {/* Left: Live Status */}
                        <div className="flex flex-col border-r border-slate-100 pr-6">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Right Now</span>
                            <div className="flex items-baseline">
                                <span className={`text-6xl font-[800] tracking-tighter leading-none ${realtime.wait_time > 30 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                    {realtime.wait_time}
                                </span>
                                <span className="text-lg font-bold text-slate-300 ml-1">min</span>
                            </div>
                        </div>

                        {/* Right: Typical for Today */}
                        <div className="flex flex-col pt-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Typical {dayName}</span>
                            <div className="flex items-baseline">
                                <span className={`text-4xl font-[800] tracking-tighter text-slate-900 leading-none`}
                                >{realtime.official_avg_minutes || stats.avg_wait}</span>
                                <span className="text-sm font-bold text-slate-400 ml-1">min avg</span>
                            </div>
                            <p className="text-xs font-medium text-slate-500 mt-2 leading-tight">
                                Current wait is <span className="font-bold">{realtime.wait_time < (realtime.official_avg_minutes || stats.avg_wait) ? 'lower' : 'higher'}</span> than usual.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. Hourly Trend Chart - Only 6 key hours */}
                <div className="bg-white rounded-[32px] p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)] ring-1 ring-slate-100">
                    <h3 className="text-base font-[800] text-slate-900 mb-6">Typical Hourly Trend on {dayName}</h3>

                    <div className="flex items-end h-40 mt-8 mb-2 gap-2">
                        {chartData.map((h, i) => {
                            // Calculate bar height in pixels (max height = 120px)
                            const maxHeight = 120;
                            // Ensure tiny bars have at least 4px so they are visible
                            const maxVal = Math.max(...chartData.map(d => d.wait), 1);
                            const barHeight = h.wait > 0 ? Math.max(4, (h.wait / maxVal) * maxHeight) : 2;

                            return (
                                <div key={h.hour} className="flex flex-col flex-1 h-full justify-end group relative">
                                    {/* Mins Label: Simple, Always Visible, Above Bar */}
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-[800] text-slate-500 mb-1 z-10 w-full text-center">
                                        {h.wait}m
                                    </div>

                                    {/* Vertical Bar */}
                                    <div
                                        className="w-full mx-0.5 bg-indigo-100 group-hover:bg-indigo-200 transition-all relative rounded-t-xl overflow-hidden"
                                        style={{
                                            height: `${barHeight}px`,
                                        }}
                                    >
                                        {/* Soft Gradient Overlay */}
                                        <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-indigo-300/50 to-transparent" />

                                        {/* Top Cap Line */}
                                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-400 group-hover:bg-indigo-500 rounded-full mx-1 mt-1 opacity-50" />
                                    </div>

                                    {/* Hour label */}
                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400">
                                        {getLabel(h.hour)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 3. Grid Widgets */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Best Time to Go */}
                    <div className="bg-white rounded-[32px] p-6 shadow-sm ring-1 ring-slate-100">
                        <div className="text-xs font-semibold text-slate-400 mb-1">Best Time to Go</div>
                        <div className="text-lg font-[800] text-slate-900">{stats.best_time}</div>
                    </div>

                    {/* Worst Time */}
                    <div className="bg-white rounded-[32px] p-6 shadow-sm ring-1 ring-slate-100">
                        <div className="text-xs font-semibold text-slate-400 mb-1">Worst Time</div>
                        <div className="text-lg font-[800] text-slate-900">{stats.worst_time}</div>
                    </div>

                    {/* Weather Impact */}
                    <div className="bg-white rounded-[32px] p-6 shadow-sm ring-1 ring-slate-100 col-span-1">
                        <div className="text-xs font-semibold text-slate-400 mb-1">Weather Impact</div>
                        <div className="text-sm font-[800] text-slate-900 leading-tight">
                            {context.is_raining
                                ? <>Rain adds <span className="text-indigo-600">+{stats.weather_impact_mins}m</span></>
                                : "No rain delays today."}
                        </div>
                    </div>

                    {/* Holiday Warning */}
                    <div className="bg-white rounded-[32px] p-6 shadow-sm ring-1 ring-slate-100 col-span-1">
                        <div className="text-xs font-semibold text-slate-400 mb-1">Next Holiday</div>
                        <div className="text-sm font-[800] text-slate-900 leading-tight">
                            {context.next_holiday || "None nearby"}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
