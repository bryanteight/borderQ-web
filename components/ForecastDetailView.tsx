'use client';

import { ComparisonForecast } from "@/lib/api";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { ArrowLeft, CheckCircle2, Info, Navigation, Zap, AlertCircle } from "lucide-react";
import Link from "next/link";

export function ForecastDetailView({ forecast }: { forecast: ComparisonForecast }) {
    // 1. Combine 3-port slots into one data array for the chart
    const chartData = Array.from({ length: 96 }, (_, idx) => {
        const h = Math.floor(idx / 4);
        const m = (idx % 4) * 15;
        const timeLabel = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

        const dataPoint: any = { time: timeLabel };

        // Map individual port values to the data point
        Object.values(forecast.ports).forEach(port => {
            dataPoint[port.slug] = port.forecast_96_slots[idx];
        });

        return dataPoint;
    });

    const dateObj = new Date(forecast.date + 'T12:00:00');

    // COLORS for ports
    const colors: Record<string, string> = {
        "peace-arch": "#3b82f6",     // Blue
        "peace-arch-nb": "#3b82f6",  // Blue
        "pacific-highway": "#a78bfa", // Purple
        "pacific-highway-nb": "#a78bfa", // Purple
        "lynden": "#94a3b8",          // Gray
        "lynden-nb": "#94a3b8"        // Gray
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
                    <div className="bg-indigo-600 p-4 rounded-2xl text-white">
                        <Navigation className="w-8 h-8" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-indigo-600 font-[900] text-xs uppercase tracking-[0.2em] mb-1">AI Smart Recommendation</h3>
                        <p className="text-slate-900 text-xl md:text-2xl font-[800] tracking-tight leading-tight">
                            {forecast.smart_pick.reason}
                        </p>
                    </div>
                    <div className="flex -space-x-2">
                        {forecast.smart_pick.recommended_port_ids.map(pid => (
                            <div key={pid} className="w-12 h-12 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm uppercase">
                                {pid.substring(pid.length - 2)}
                            </div>
                        ))}
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

                                return (
                                    <div key={port.id} className="group">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className={`text-sm font-bold ${isBest ? 'text-slate-900' : 'text-slate-400'}`}>
                                                {port.name.split('(')[0]}
                                            </span>
                                            <span className={`text-xl font-[900] ${isBest ? 'text-indigo-600' : 'text-slate-900'}`}>
                                                {avg}m
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${isBest ? 'bg-indigo-500' : 'bg-slate-300'}`}
                                                style={{ width: `${Math.min(100, (avg / 60) * 100)}%` }}
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
                            <h3 className="text-sm font-[800] text-slate-400 uppercase tracking-wider mb-1">
                                24-Hour Comparison
                            </h3>
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
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                                        padding: '12px 16px',
                                        fontFamily: 'var(--font-inter)'
                                    }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 700 }}
                                    labelStyle={{ color: '#64748b', fontSize: '11px', marginBottom: '8px', fontWeight: 600 }}
                                />
                                <Legend wrapperStyle={{ display: 'none' }} />

                                {Object.values(forecast.ports).map(port => (
                                    <Line
                                        key={port.id}
                                        type="monotone"
                                        dataKey={port.slug}
                                        name={port.name.split(' (')[0]}
                                        stroke={colors[port.slug]}
                                        strokeWidth={port.slug.includes('peace') ? 4 : 2}
                                        dot={false}
                                        animationDuration={2000}
                                        strokeDasharray={port.slug.includes('lynden') ? "5 5" : "0"}
                                    />
                                ))}
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

            <div className="max-w-6xl mx-auto mt-12 mb-12 flex justify-center">
                <div className="bg-white px-6 py-4 rounded-3xl border border-slate-200 flex items-center gap-8 shadow-sm">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm font-bold text-slate-700">Peace Arch Douglas</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-50">
                        <AlertCircle className="w-5 h-5 text-indigo-500" />
                        <span className="text-sm font-bold text-slate-700">Pacific Highway</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-30">
                        <AlertCircle className="w-5 h-5 text-slate-400" />
                        <span className="text-sm font-bold text-slate-700">Lynden</span>
                    </div>
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
