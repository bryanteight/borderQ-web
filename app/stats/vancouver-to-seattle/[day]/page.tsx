import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ComparisonChartWrapper } from "@/components/ComparisonChartWrapper";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ day: string }> }): Promise<Metadata> {
    const { day } = await params;
    const dayName = (day.charAt(0).toUpperCase() + day.slice(1)).replace(/-/g, " ");

    // Only pluralize weekdays (e.g. "Sundays"), not holidays (e.g. "Christmas")
    const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const isWeekday = weekdays.includes(day.toLowerCase());
    const titleDay = isWeekday ? `${dayName}s` : dayName;

    return {
        title: `Best Time to Cross Border: Vancouver (BC) to Seattle (WA) on ${titleDay} | BorderQ`,
        description: `Historical border wait time forecasts for ${dayName}. Compare Peace Arch vs Pacific Highway traffic patterns for your trip to Seattle (Southbound).`,
        alternates: {
            canonical: `/stats/vancouver-to-seattle/${day}`,
        },
        openGraph: {
            title: `Best Time to Cross: Vancouver (BC) to Seattle (WA) on ${titleDay}`,
            description: `Don't get stuck at the border. See historical wait time trends for ${dayName} and choose the best crossing to Seattle.`,
            type: 'article',
        }
    };
}

export default async function RegionalStatsPage({ params }: { params: Promise<{ day: string }> }) {
    const { day } = await params;
    const dayName = (day.charAt(0).toUpperCase() + day.slice(1)).replace(/-/g, " ");

    // 3-Port Comparison Chart & AI Insight
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
                        Vancouver (BC) to Seattle (WA) Prediction (Southbound)
                    </h2>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 space-y-8">
                {/* 3-Port Comparison Chart & AI Insight */}
                <section className="-mt-4">
                    <ComparisonChartWrapper day={day} />
                </section>
            </div>
        </div>
    );
}
