'use client';

import { useDirection } from "@/context/DirectionContext";
import { getComparisonForecast, ComparisonForecast } from "@/lib/api";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Navigation, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function SmartForecastWidget() {
    const { direction } = useDirection();
    const [forecast, setForecast] = useState<ComparisonForecast | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function load() {
            setLoading(true);
            const target = new Date();
            // We focus on planning for "Tomorrow"
            target.setDate(target.getDate() + 1);
            const dateStr = target.toISOString().split('T')[0];

            const data = await getComparisonForecast(dateStr, direction);
            setForecast(data);
            setLoading(false);
        }
        load();
    }, [direction]);

    if (loading) return (
        <div className="w-full h-32 bg-white rounded-3xl border border-slate-200 animate-pulse mb-8" />
    );

    if (!forecast) return null;

    const urlDir = direction === "SOUTHBOUND" ? "vancouver-to-seattle" : "seattle-to-vancouver";

    // Sort ports by wait to show them in a meaningful order
    const sortedPorts = Object.values(forecast.ports).sort((a, b) =>
        forecast.smart_pick.average_waits[a.id] - forecast.smart_pick.average_waits[b.id]
    );

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-xl font-[900] tracking-tight flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-500 fill-indigo-100" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-900">
                        Smart Forecast
                    </span>
                </h3>
            </div>

            <Link href={`/forecast/${urlDir}/${forecast.date}`}>
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="relative bg-white border border-indigo-100 p-6 md:p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-300 transition-all group overflow-hidden"
                >
                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-bl-full -z-10 group-hover:bg-indigo-100/30 transition-colors" />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">

                        {/* 1. Recommendation Logic (Concern 2) */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] bg-indigo-50 px-2 py-0.5 rounded">
                                    {new Date(forecast.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                </span>
                                {forecast.is_holiday && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-600 uppercase tracking-widest">
                                        Holiday Pattern
                                    </span>
                                )}
                            </div>

                            <h4 className="text-2xl md:text-3xl font-[900] text-slate-900 tracking-tight leading-tight mb-4 group-hover:text-indigo-950 transition-colors">
                                {forecast.smart_pick.reason}
                            </h4>

                            {/* Mult-Port Comparison Summary (Concern 1: Loading latency solved by pre-gen) */}
                            <div className="flex flex-wrap gap-4">
                                {sortedPorts.map(port => {
                                    const avg = Math.round(forecast.smart_pick.average_waits[port.id]);
                                    const isBest = forecast.smart_pick.recommended_port_ids.includes(port.id);

                                    return (
                                        <div key={port.id} className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${isBest ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                            <span className={`text-[11px] font-[800] uppercase tracking-tighter ${isBest ? 'text-slate-900' : 'text-slate-400'}`}>
                                                {port.slug.split('-')[0]}: <span className={isBest ? 'text-emerald-600' : 'text-slate-500'}>{avg}m</span>
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 2. Visual / Action */}
                        <div className="flex items-center gap-6 shrink-0">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Detailed View</p>
                                <div className="flex items-center gap-2 text-indigo-600 font-black">
                                    <Zap className="w-4 h-4 fill-indigo-600" />
                                    <span>AI Analysis</span>
                                </div>
                            </div>

                            <div className="bg-slate-900 text-white p-5 rounded-full group-hover:bg-indigo-600 transition-all group-hover:translate-x-1 shadow-lg shadow-slate-200 group-hover:shadow-indigo-200">
                                <ArrowRight className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </Link>
        </div>
    );
}
