import React from "react";
import Link from "next/link";
import { ArrowLeft, Database, TrendingUp, Clock } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ day: string }> }): Promise<Metadata> {
    const { day } = await params;
    const dayName = (day.charAt(0).toUpperCase() + day.slice(1)).replace(/-/g, " ");

    const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const isWeekday = weekdays.includes(day.toLowerCase());
    const titleDay = isWeekday ? `${dayName}s` : dayName;

    return {
        title: `Best Time to Cross Border: Seattle (WA) to Vancouver (BC) on ${titleDay} | BorderQ`,
        description: `Historical border wait time forecasts for ${dayName}. Compare Peace Arch vs Pacific Highway traffic patterns for your trip to Vancouver (Northbound).`,
        alternates: {
            canonical: `/stats/seattle-to-vancouver/${day}`,
        },
        openGraph: {
            title: `Best Time to Cross: Seattle (WA) to Vancouver (BC) on ${titleDay}`,
            description: `Don't get stuck at the border. See historical wait time trends for ${dayName} and choose the best crossing to Vancouver.`,
            type: 'article',
        }
    };
}

export default async function RegionalStatsPageNB({ params }: { params: Promise<{ day: string }> }) {
    const { day } = await params;
    const dayName = (day.charAt(0).toUpperCase() + day.slice(1)).replace(/-/g, " ");

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-20">
            {/* 1. Header Hero */}
            <div className="bg-white border-b border-indigo-50/50 relative overflow-hidden">
                <div className="max-w-3xl mx-auto px-6 py-12 relative z-10">
                    <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors mb-8 group">
                        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>

                    <h1 className="text-2xl sm:text-4xl font-[800] text-slate-900 mb-2 leading-tight">
                        <span className="text-indigo-600">{dayName}:</span> Best Time to Cross
                    </h1>
                    <h2 className="text-lg sm:text-xl font-medium text-slate-500 mb-6">
                        Seattle (WA) to Vancouver (BC) Prediction
                    </h2>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 space-y-8">
                {/* Data Collection Notice */}
                <section className="mt-8">
                    <div className="bg-white rounded-[2rem] border border-slate-200 p-8 md:p-12 text-center shadow-sm">
                        {/* Icon */}
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                            <Database className="w-10 h-10 text-indigo-600" />
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-[800] text-slate-900 mb-3">
                            Data Collection in Progress
                        </h3>

                        {/* Description */}
                        <p className="text-slate-600 leading-relaxed max-w-md mx-auto mb-8">
                            We're actively gathering Northbound traffic patterns to build accurate {dayName} forecasts.
                            Our AI needs at least 30 days of data per weekday to generate reliable predictions.
                        </p>

                        {/* Progress Indicators */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-lg mx-auto">
                            <div className="bg-slate-50 rounded-xl p-4">
                                <div className="flex items-center justify-center gap-2 text-emerald-600 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Active</span>
                                </div>
                                <p className="text-sm font-medium text-slate-700">Data Ingestion</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-4">
                                <div className="flex items-center justify-center gap-2 text-amber-600 mb-1">
                                    <Clock className="w-3 h-3" />
                                    <span className="text-xs font-bold uppercase tracking-wider">~18 Days</span>
                                </div>
                                <p className="text-sm font-medium text-slate-700">Collected</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-4">
                                <div className="flex items-center justify-center gap-2 text-indigo-600 mb-1">
                                    <TrendingUp className="w-3 h-3" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Soon</span>
                                </div>
                                <p className="text-sm font-medium text-slate-700">AI Insights</p>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href={`/stats/vancouver-to-seattle/${day}`}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-colors"
                            >
                                View Southbound Forecast
                                <ArrowLeft className="w-4 h-4 rotate-180" />
                            </Link>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-full hover:bg-slate-200 transition-colors"
                            >
                                Live Dashboard
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
