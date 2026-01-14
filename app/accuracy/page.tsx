"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";
import dynamic from 'next/dynamic';

// Dynamic import for Recharts to avoid SSR issues
const AccuracyChart = dynamic(() => import('../../components/AccuracyChart'), { ssr: false });

interface WeeklyData {
    week: string;
    avg_mae: number | null;
    avg_mape: number | null;
    avg_rmse: number | null;
    days_with_data: number;
}

interface ApiResponse {
    data: WeeklyData[];
}

export default function AccuracyPage() {
    const [crossingId, setCrossingId] = useState("02300402"); // Default to Peace Arch
    const [data, setData] = useState<WeeklyData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
                const res = await fetch(`${apiUrl}/analytics/accuracy/weekly?crossing_id=${crossingId}&weeks=12`);
                const json: ApiResponse = await res.json();
                setData(json.data || []);
            } catch (error) {
                console.error("Failed to fetch accuracy data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [crossingId]);

    // Quick Stats Calculation
    const latest = data.length > 0 ? data[data.length - 1] : null;
    const prev = data.length > 1 ? data[data.length - 2] : null;

    let trend = "stable";
    if (latest && prev && latest.avg_mae != null && prev.avg_mae != null) {
        const change = latest.avg_mae - prev.avg_mae;
        if (change < -0.5) trend = "improving";
        if (change > 0.5) trend = "declining";
    }

    // Chart Data Preparation - Ensure clean data for Recharts
    const chartData = data.map(d => ({
        week: d.week.split("-")[1], // "W02"
        fullWeek: d.week,
        mae: d.avg_mae,
        mape: d.avg_mape
    }));

    return (
        <div className="min-h-screen bg-app-bg text-slate-900 p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Link href="/stats/peace-arch/today" className="text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 p-2 rounded-full">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Forecast Accuracy</h1>
                        </div>
                        <p className="text-slate-500 ml-11">Tracking prediction quality over time</p>
                    </div>

                    <select
                        value={crossingId}
                        onChange={(e) => setCrossingId(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                    >
                        <option value="02300401">Pacific Highway (Southbound)</option>
                        <option value="02300402">Peace Arch (Southbound)</option>
                        <option value="02302301">Lynden (Southbound)</option>
                        <option value="NB_02300401">Pacific Highway (Northbound)</option>
                        <option value="NB_02300402">Peace Arch (Northbound)</option>
                    </select>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-soft-xl border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Latest MAE</span>
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                <span className="text-blue-600 text-xs font-bold">AVG</span>
                            </div>
                        </div>
                        <div className="text-4xl font-mono font-bold text-slate-900 tracking-tighter">
                            {latest?.avg_mae ? latest.avg_mae : '--'} <span className="text-lg text-slate-400 font-sans font-normal">min</span>
                        </div>
                        <div className="text-sm text-slate-500 mt-2">Avg minutes off target</div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-soft-xl border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Latest MAPE</span>
                            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                                <span className="text-amber-600 text-xs font-bold">%</span>
                            </div>
                        </div>
                        <div className="text-4xl font-mono font-bold text-slate-900 tracking-tighter">
                            {latest?.avg_mape ? latest.avg_mape : '--'} <span className="text-lg text-slate-400 font-sans font-normal">%</span>
                        </div>
                        <div className="text-sm text-slate-500 mt-2">Avg percentage error</div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-soft-xl border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Trend</span>
                            <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center", {
                                "bg-emerald-50": trend === "improving",
                                "bg-rose-50": trend === "declining",
                                "bg-slate-50": trend === "stable"
                            })}>
                                {trend === "improving" && <TrendingDown className="w-4 h-4 text-emerald-600" />}
                                {trend === "declining" && <TrendingUp className="w-4 h-4 text-rose-600" />}
                                {trend === "stable" && <Minus className="w-4 h-4 text-slate-600" />}
                            </div>
                        </div>
                        <div className={clsx("text-4xl font-bold tracking-tighter", {
                            "text-emerald-600": trend === "improving",
                            "text-rose-600": trend === "declining",
                            "text-slate-700": trend === "stable"
                        })}>
                            {trend === "improving" ? "Improving" :
                                trend === "declining" ? "Declining" : "Stable"}
                        </div>
                        <div className="text-sm text-slate-500 mt-2">Week-over-week change</div>
                    </div>
                </div>

                {/* Main Chart */}
                <div className="bg-white rounded-2xl shadow-soft-xl border border-slate-100 p-6 md:p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Weekly Accuracy Trend</h3>
                            <p className="text-sm text-slate-500">Comparing forecast error (MAE) over previous weeks</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-slate-600 font-medium">MAE (min)</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[350px] w-full">
                        {loading ? (
                            <div className="h-full flex items-center justify-center text-slate-400">Loading chart data...</div>
                        ) : data.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-slate-400">No data available</div>
                        ) : (
                            <AccuracyChart data={chartData} />
                        )}
                    </div>
                </div>

                {/* Metric Explanations */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6">
                        <h4 className="text-slate-900 font-bold mb-2 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div> MAE
                        </h4>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Mean Absolute Error. The average number of minutes our forecast differs from the actual wait time. Lower is better.
                        </p>
                    </div>
                    <div className="p-6 border-l border-slate-200">
                        <h4 className="text-slate-900 font-bold mb-2 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div> MAPE
                        </h4>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Mean Absolute Percentage Error. Useful for comparing accuracy across different wait time volumes, though it can spike when wait times are very low.
                        </p>
                    </div>
                    <div className="p-6 border-l border-slate-200">
                        <h4 className="text-slate-900 font-bold mb-2 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div> RMSE
                        </h4>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Root Mean Square Error. This metric penalizes large outlier errors more heavily than MAE, helping identify inconsistent predictions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
