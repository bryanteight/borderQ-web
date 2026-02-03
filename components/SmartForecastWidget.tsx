'use client';

import { useDirection } from "@/context/DirectionContext";
import { getSpecificForecast, SpecificForecast } from "@/lib/api";
import { useEffect, useState } from "react";
import { ArrowRight, Calendar, Sparkles, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function SmartForecastWidget() {
    const { direction } = useDirection();
    const [forecast, setForecast] = useState<SpecificForecast | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function load() {
            setLoading(true);
            // Calculate "Target Date" - Let's pick Tomorrow for "Planning"
            const target = new Date();
            target.setDate(target.getDate() + 1);
            const dateStr = target.toISOString().split('T')[0];

            // Primary crossing ID for direction (Peace Arch)
            const crossingId = "02300402";

            const data = await getSpecificForecast(dateStr, crossingId, direction);
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
                    className="relative bg-white border border-indigo-100 p-6 rounded-3xl shadow-sm hover:shadow-indigo-100/50 hover:border-indigo-300 transition-all group overflow-hidden"
                >
                    {/* Decor */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[4rem] -z-10 group-hover:bg-indigo-100/50 transition-colors" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">

                        {/* Left: Info */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Planning for Tomorrow
                                </span>
                                {forecast.context.is_holiday && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-600 uppercase">
                                        Holiday
                                    </span>
                                )}
                            </div>
                            <div className="flex items-baseline gap-3">
                                <h4 className="text-3xl font-[900] text-slate-900 tracking-tight">
                                    {new Date(forecast.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' })}
                                </h4>
                                <span className="text-slate-500 font-medium whitespace-nowrap">
                                    {new Date(forecast.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                            </div>

                            {/* Best Window */}
                            <div className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-700">
                                <div className="bg-emerald-100 p-1 rounded-full text-emerald-600">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                </div>
                                <span>
                                    Best time: <span className="font-bold text-emerald-700">{convertToAMPM(forecast.best_window.start)} - {convertToAMPM(forecast.best_window.end)}</span>
                                </span>
                            </div>
                        </div>

                        {/* Right: Action */}
                        <div className="flex items-center gap-4 self-start sm:self-center">
                            <div className="text-right hidden sm:block">
                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Confidence
                                </span>
                                <span className="text-indigo-600 font-bold text-sm">
                                    {forecast.confidence}
                                </span>
                            </div>

                            <div className="bg-slate-900 text-white p-3 rounded-full group-hover:bg-indigo-600 transition-colors">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </Link>
        </div>
    );
}

function convertToAMPM(time24: string) {
    if (!time24) return "--:--";
    const [h, m] = time24.split(':');
    let hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    return `${hour}:${m} ${ampm}`;
}
