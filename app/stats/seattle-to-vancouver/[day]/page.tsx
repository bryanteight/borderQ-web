import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, TrendingUp, Navigation, Clock, Car } from "lucide-react";

// Reusing types from the single port schema for consistency
interface StatsResponse {
    realtime: {
        wait_time: number;
        official_avg_minutes: number;
        weather: string;
        status: string;
    };
    stats: {
        avg_wait: number;
        best_time: string;
        worst_time: string;
        max_wait: number;
        min_wait: number;
        hourly: { hour: number; wait: number }[];
        sample_size: number;
    };
    context: {
        next_holiday: string | null;
        is_raining: boolean;
    };
}

interface Narrative {
    intro: string;
    savings_analysis: string;
}

interface ForecastResponse {
    day: string;
    ports: {
        name: string;
        id: string;
        slug: string;
        data: StatsResponse;
    }[];
    best_option: any;
    narrative: Narrative;
}

// Fetch helper
async function getForecastData(day: string): Promise<ForecastResponse | null> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const cleanUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const res = await fetch(`${cleanUrl}/api/v1/forecast/${day}`, { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch (e) {
        console.error(`Fetch error for ${day}:`, e);
        return null;
    }
}

import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ day: string }> }): Promise<Metadata> {
    const { day } = await params;
    const dayName = day.charAt(0).toUpperCase() + day.slice(1).replace("-", " ");

    // Only pluralize weekdays (e.g. "Sundays"), not holidays (e.g. "Christmas")
    const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const isWeekday = weekdays.includes(day.toLowerCase());
    const titleDay = isWeekday ? `${dayName}s` : dayName;

    return {
        title: `Best Time to Cross Border: Seattle to Vancouver on ${titleDay} | BorderQ`,
        description: `Historical border wait time forecasts for ${dayName}. Compare Peace Arch vs Pacific Highway traffic patterns to save time on your trip to Vancouver.`,
        alternates: {
            canonical: `/stats/seattle-to-vancouver/${day}`,
        },
        openGraph: {
            title: `Best Time to Cross: Seattle to Vancouver on ${titleDay}`,
            description: `Don't get stuck at the border. See historical wait time trends for ${dayName} and choose the best crossing.`,
            type: 'article',
        }
    };
}

export default async function RegionalStatsPage({ params }: { params: Promise<{ day: string }> }) {
    const { day } = await params;
    const dayName = day.charAt(0).toUpperCase() + day.slice(1);

    // 1. Fetch Aggregate Forecast (Single Request)
    const forecast = await getForecastData(day);

    // Handle failure
    if (!forecast || !forecast.ports || forecast.ports.length === 0) {
        notFound();
    }

    const { ports, narrative, best_option } = forecast;

    // Safety check filtering
    const validPorts = ports.filter(p => p.data?.stats && p.data.stats.sample_size > 0);

    // Handle case where NO ports have data (e.g. obscure holiday)
    if (validPorts.length === 0) {
        return (
            <main className="min-h-screen bg-[#F6F8FA] flex flex-col items-center justify-center p-6 text-center">
                <Link href="/" className="mb-8 p-3 bg-white rounded-full shadow-sm text-slate-400 hover:text-slate-900 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-md">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <Clock className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-[900] text-slate-900 mb-2">Analyzing {dayName}...</h1>
                    <p className="text-slate-500 leading-relaxed mb-6">
                        We're currently gathering historical traffic data for <strong>{dayName}</strong>.
                        Please check back later as our AI builds more patterns.
                    </p>
                    <Link href="/" className="inline-block bg-indigo-600 text-white font-bold py-3 px-8 rounded-full hover:bg-indigo-700 transition-colors">
                        Check Live Wait Times
                    </Link>
                </div>
            </main>
        );
    }

    const bestPort = validPorts.find(p => p.name === best_option.name) || validPorts[0];
    const worstPort = validPorts.reduce((prev, curr) =>
        (curr.data.stats.avg_wait > prev.data.stats.avg_wait) ? curr : prev
        , validPorts[0]);

    // Lynden Logic: If Lynden is best, apply 20m warning (Client side display logic)
    const isLyndenRecommendation = bestPort.slug === 'lynden';

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
                        Seattle to Vancouver Prediction
                    </h2>

                    <div className="flex items-center gap-2 text-slate-500 font-medium mb-6 text-sm bg-slate-100 w-fit px-3 py-1.5 rounded-full">
                        <Car className="w-4 h-4" />
                        <span>Standard Passenger Vehicles</span>
                    </div>

                    {/* Secret Sauce Narrative - Dumb Render */}
                    <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
                        <p className="text-lg sm:text-2xl font-medium">{narrative.intro}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 space-y-8">

                {/* 1. SEO Text Block */}
                <section className="space-y-4">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
                        Detailed Traffic Analysis
                    </h2>

                    <div className="prose prose-slate leading-relaxed text-slate-600">
                        {/* Dynamic Narrative from Backend */}


                        {/* Lynden Warning Block */}
                        {isLyndenRecommendation && (
                            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 my-4 text-amber-800 text-sm">
                                <p className="font-bold mb-1">⚠️ Important Detour Note</p>
                                <p>
                                    Lynden (Aldergrove) is a smaller crossing with <strong>no direct highway access</strong>.
                                    Please add roughly <strong>20 minutes</strong> to your total drive time compared to I-5 (Peace Arch/Pacific Hwy).
                                    Only choose Lynden if the border wait savings exceed 20 minutes.
                                </p>
                            </div>
                        )}

                        <p>
                            {narrative.savings_analysis}

                            <br />
                            The heaviest congestion usually occurs around {worstPort.data?.stats.worst_time}.
                        </p>
                        <p>
                            For the fastest crossing, aim to arrive <strong>{bestPort.data?.stats.best_time}</strong>.
                            Avoid the peak rush at {worstPort.name} if possible.
                        </p>
                    </div>
                </section>

                {/* 2. Comparison Table/Cards (Visuals After Text) */}
                <section>
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Port Comparison ({dayName})</h2>
                    <div className="flex flex-col md:grid md:grid-cols-2 gap-3">
                        {ports.map((port) => {
                            const live = port.data?.realtime.wait_time || 0;

                            return (
                                <Link
                                    key={port.id}
                                    href={`/stats/${port.slug}/${day}`}
                                    className="block group bg-white rounded-2xl p-4 shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md hover:ring-indigo-200"
                                >
                                    {/* Mobile: Row Layout / Desktop: Keep flexible */}
                                    <div className="flex items-center justify-between">

                                        {/* Left: Name & Wait */}
                                        <div className="flex items-center gap-4">
                                            <div className="min-w-[100px]">
                                                <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{port.name}</div>
                                                <div className="text-xs text-slate-400 font-medium">Wait Range</div>
                                                <div className="text-sm font-[800] text-slate-700">
                                                    {port.data?.stats.min_wait}-{port.data?.stats.max_wait} <span className="text-[10px] font-bold text-slate-400">min</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Middle: Best Time */}
                                        <div className="hidden sm:block">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase">Best Time</div>
                                            <div className="text-sm font-bold text-slate-600">{port.data?.stats.best_time}</div>
                                        </div>

                                        {/* Right: Live Status (Right Aligned) */}
                                        <div className="text-right pl-4 border-l border-slate-100">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase">Right Now</div>
                                            <div className={`text-lg font-[800] ${live > 30 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                                {live} min
                                            </div>
                                        </div>

                                        {/* Mobile Arrow (Visual cue) */}
                                        <ArrowLeft className="w-4 h-4 text-slate-300 rotate-180 group-hover:text-indigo-600 transition-colors ml-2 sm:hidden" />
                                    </div>

                                    {/* Mobile: Best Time (Row 2 for ultra-compactness if needed, or keep inline? Inline above might be tight on SE) */}
                                    {/* Let's show Best Time below name on tiny screens if needed, but flex row usually fits if names are short. */}
                                    {/* Actually, let's keep it simple. Name/Range | Right Now.  Best Time is nice but maybe secondary? */}
                                    {/* User prompt implied showing Best Time. Let's add it under Name for mobile if hidden above. */}
                                    <div className="sm:hidden mt-2 pt-2 border-t border-slate-50 flex items-center justify-between text-xs">
                                        <span className="text-slate-400 font-medium">Best Time:</span>
                                        <span className="font-bold text-slate-700">{port.data?.stats.best_time}</span>
                                    </div>

                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* 3. Action Footer */}
                <div className="bg-indigo-50 rounded-2xl p-6 text-center">
                    <p className="text-sm text-indigo-800 font-medium mb-2">Crossing the border now?</p>
                    <Link href="/" className="inline-block bg-indigo-600 text-white font-bold py-3 px-6 rounded-full hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                        View Live Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
