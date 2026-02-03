'use client';

import { SpecificForecast } from "@/lib/api";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceArea } from "recharts";
import { ArrowLeft, Calendar, Cloud, Info, MapPin, Zap } from "lucide-react";
import Link from "next/link";

export function ForecastDetailView({ forecast }: { forecast: SpecificForecast }) {
    // Transform 96 slots to Chart Data
    const chartData = forecast.forecast_96_slots.map((val, idx) => {
        const h = Math.floor(idx / 4);
        const m = (idx % 4) * 15;
        const timeLabel = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        return {
            time: timeLabel,
            wait: val,
            best: (timeLabel >= forecast.best_window.start && timeLabel <= forecast.best_window.end)
        };
    });

    const dateObj = new Date(forecast.date + 'T12:00:00');

    return (
        <div className="min-h-screen bg-[#F6F8FA] p-4 md:p-8 font-sans">
            {/* Header */}
            <div className="max-w-5xl mx-auto mb-8">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors group">
                    <div className="bg-white p-2 rounded-full border border-slate-200 group-hover:border-slate-300 shadow-sm">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm">Back to Dashboard</span>
                </Link>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-[900] uppercase tracking-wider">
                                Artificial Intelligence
                            </span>
                            <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                {getPortName(forecast.crossing_id)}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-[900] text-slate-900 tracking-tight mb-2">
                            {forecast.direction === "SOUTHBOUND" ? "Southbound" : "Northbound"} Forecast
                        </h1>
                        <p className="text-xl text-slate-500 font-medium">
                            {dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>

                    {/* Tier Badge / Metadata */}
                    <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-200">
                            <Zap className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                            <span className="text-sm font-bold uppercase tracking-wider">
                                {forecast.tier_used.replace('TIER_', '').replace(/_/g, ' ')}
                            </span>
                        </div>
                        <div className="text-xs font-bold text-slate-400">
                            Confidence: <span className="text-slate-700">{forecast.confidence}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 1. Context Panel (Left) */}
                <div className="lg:col-span-1 space-y-4">
                    {/* Best Window Card */}
                    <div className="bg-white border border-emerald-100 p-6 rounded-3xl shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[4rem] -z-10 group-hover:scale-110 transition-transform" />

                        <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">
                            Best Time to Cross
                        </h3>
                        <div className="text-4xl font-[900] text-emerald-950 tracking-tighter mb-1">
                            {convertToAMPM(forecast.best_window.start)}
                        </div>
                        <div className="inline-block bg-emerald-100 px-3 py-1 rounded-full">
                            <p className="text-xs text-emerald-800 font-bold uppercase tracking-wide">
                                Until {convertToAMPM(forecast.best_window.end)}
                            </p>
                        </div>
                    </div>

                    {/* Logic Explainer */}
                    <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
                        <h3 className="text-sm font-[800] text-slate-900 mb-5 flex items-center gap-2">
                            <Info className="w-4 h-4 text-indigo-500" />
                            How this was calculated
                        </h3>

                        <ul className="space-y-4">
                            {forecast.context.is_holiday && (
                                <li className="flex items-start gap-3">
                                    <div className="bg-rose-100 p-2 rounded-xl text-rose-600 shrink-0">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block mb-0.5">Holiday Match</span>
                                        <span className="text-sm font-medium text-slate-700 leading-tight block">
                                            Pattern based on historical <span className="font-bold">{forecast.context.holiday_name}</span> data.
                                        </span>
                                    </div>
                                </li>
                            )}

                            <li className="flex items-start gap-3">
                                <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600 shrink-0">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-0.5">Similarity Search</span>
                                    <span className="text-sm font-medium text-slate-700 leading-tight block">
                                        Found <span className="font-bold">{forecast.similar_days.length} days</span> in history with similar conditions.
                                    </span>
                                </div>
                            </li>

                            <li className="flex items-start gap-3">
                                <div className="bg-slate-100 p-2 rounded-xl text-slate-600 shrink-0">
                                    <Cloud className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Context</span>
                                    <span className="text-sm font-medium text-slate-700 leading-tight block">
                                        Adjusted for day-of-week, weather, and known events.
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* 2. Chart Component (Right - span 2) */}
                <div className="lg:col-span-2 bg-white border border-slate-200 p-6 md:p-8 rounded-3xl shadow-sm min-h-[450px] flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-[800] text-slate-400 uppercase tracking-wider">
                            24-Hour Wait Prediction
                        </h3>
                        <div className="flex gap-4 text-xs font-bold">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                <span className="text-slate-600">Predicted</span>
                            </div>
                            {/* Placeholder for "Typical" if we had it */}
                        </div>
                    </div>

                    <div className="flex-1 w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorWait" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="time"
                                    tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                                    interval={7} // roughly every 2 hours
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
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                                        padding: '12px 16px',
                                        fontFamily: 'var(--font-inter)'
                                    }}
                                    itemStyle={{ color: '#1e293b', fontWeight: 700, fontSize: '14px' }}
                                    labelStyle={{ color: '#64748b', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}
                                />
                                <ReferenceArea
                                    x1={forecast.best_window.start}
                                    x2={forecast.best_window.end}
                                    fill="#10b981"
                                    fillOpacity={0.05}
                                    strokeOpacity={0}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="wait"
                                    name="Wait Time"
                                    stroke="#4f46e5"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorWait)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* Similar Days List */}
            <div className="max-w-5xl mx-auto mt-12 mb-12">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-px bg-slate-200 flex-1"></div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Based on these historical matches
                    </p>
                    <div className="h-px bg-slate-200 flex-1"></div>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                    {forecast.similar_days.map((day, i) => (
                        <div key={i} className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-500 shadow-sm">
                            {day.date}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
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

function getPortName(id: string) {
    // Normal IDs
    if (id === "02300402" || id === "NB_02300402") return "Peace Arch";
    if (id === "02300401" || id === "NB_02300401") return "Pacific Highway";
    if (id === "02302301" || id === "NB_02302301") return "Lynden";
    // Fallback
    return id;
}
