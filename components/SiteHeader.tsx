import React from 'react';
import Link from "next/link";
import { BorderQLogo } from "@/components/BorderQLogo";
import { Cloud, Droplets, Sun } from "lucide-react";
import { getBorderData } from "@/lib/api";

// Helper to get weather icon
function getWeatherIcon(condition: string) {
    const c = condition.toLowerCase();
    if (c.includes("rain") || c.includes("drizzle") || c.includes("shower") || c.includes("snow")) {
        return <Droplets className="w-4 h-4 text-sky-300" />;
    }
    if (c.includes("sun") || c.includes("clear")) {
        return <Sun className="w-4 h-4 text-amber-300" />;
    }
    return <Cloud className="w-4 h-4 text-gray-300" />;
}

export async function SiteHeader() {
    const data = await getBorderData();
    const weatherEvent = data?.data?.[0]; // Get weather source (first available)

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-white sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">

                {/* Logo Section */}
                <div className="flex items-center gap-1">
                    <Link href="/" className="flex flex-col hover:opacity-90 transition-opacity">
                        <span className="flex items-center font-[800] text-2xl sm:text-3xl tracking-tight text-slate-900 leading-none">
                            Border
                            <BorderQLogo className="w-8 h-8 sm:w-10 sm:h-10 -ml-1 mb-1" />
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-1">Traffic AI</span>
                    </Link>
                </div>
                {/* Top Right: Context Badges */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Direction Badge - Made Larger */}
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs sm:text-sm font-[800] flex items-center gap-1.5 sm:gap-2 text-slate-700 shadow-sm">
                            <span className="text-lg sm:text-xl">🇺🇸</span>
                            <span className="hidden sm:inline">USA</span>
                            <span className="text-slate-300 mx-0.5 sm:mx-1">➜</span>
                            <span className="text-lg sm:text-xl">🇨🇦</span>
                            <span className="hidden sm:inline">Canada</span>
                        </span>
                    </div>

                    {/* Weather (Mini) */}
                    {weatherEvent && (
                        <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                            {getWeatherIcon(weatherEvent.weather_condition)}
                            <span>{weatherEvent.weather_condition}</span>
                            <span className="text-slate-300 mx-1">|</span>
                            <span>{weatherEvent.temperature}°F</span>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
