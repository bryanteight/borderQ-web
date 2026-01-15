'use client';

import { ArrowRight, TrendingUp, Sun, Calendar, Star, Ticket } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PlanningData } from "@/lib/types";
import { useDirection } from "@/context/DirectionContext";

export function PlanAheadWidget({ planning }: { planning: { SOUTHBOUND: PlanningData[], NORTHBOUND: PlanningData[] } }) {
    const { direction } = useDirection();
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Safety check
    const items = planning ? (planning[direction] || planning["SOUTHBOUND"]) : [];
    const selectedItem = items[selectedIndex] || items[0];

    // Reset index when direction changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [direction, items.length]); // Also reset if items length changes (e.g., data refresh)

    if (!items || items.length === 0) return null;

    // Helper to determine icon and styles
    const getCardStyles = (item: PlanningData) => {
        if (item.impactBadge?.includes("Concert") || item.impactType === "CONCERT") {
            return {
                icon: Ticket,
                color: "amber", // Gold-ish
                badgeBg: "bg-amber-100",
                badgeText: "text-amber-800",
                iconBg: "bg-amber-100",
                iconColor: "text-amber-600"
            };
        }
        if (item.status === 'red') {
            return {
                icon: TrendingUp,
                color: "rose",
                badgeBg: "bg-rose-100",
                badgeText: "text-rose-800",
                iconBg: "bg-rose-100",
                iconColor: "text-rose-600"
            };
        }
        if (item.status === 'yellow') {
            return {
                icon: Calendar,
                color: "orange",
                badgeBg: "bg-orange-100",
                badgeText: "text-orange-800",
                iconBg: "bg-orange-100",
                iconColor: "text-orange-600"
            };
        }
        // Green
        return {
            icon: Sun,
            color: "emerald",
            badgeBg: "bg-emerald-100",
            badgeText: "text-emerald-800",
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600"
        };
    };

    const style = getCardStyles(selectedItem);
    const Icon = style.icon;

    // 4. Northbound Check: Hide widget completely
    if (direction === 'NORTHBOUND') return null;

    return (
        <div className="w-full mb-6">
            {/* Header - Prominent with Shining Effect */}
            <div className="flex items-center justify-center sm:justify-between mb-5 px-1 mt-2">
                <h3 className="text-2xl font-[900] tracking-tight relative inline-block">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 animate-gradient-x bg-[length:200%_auto]">
                        Plan Ahead
                    </span>
                    {/* Sparkle Icon for flair */}
                    <span className="absolute -top-1 -right-4 text-amber-400 animate-pulse">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L14.39 9.61L22 12L14.39 14.39L12 22L9.61 14.39L2 12L9.61 9.61L12 2Z" />
                        </svg>
                    </span>
                </h3>
            </div>

            {/* 1. Day Picker Strip */}
            <div className="flex overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide gap-3 snap-x mb-6">
                {items.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    const dateParts = item.date.split('-');
                    const safeDayNum = parseInt(dateParts[2]);
                    const dotColor = item.status === 'red' ? 'bg-rose-500' : (item.status === 'yellow' ? 'bg-amber-400' : 'bg-emerald-400');

                    return (
                        <button
                            key={item.date}
                            onClick={() => setSelectedIndex(idx)}
                            className={`
                                flex-shrink-0 flex flex-col items-center justify-center 
                                w-14 h-[4.5rem] rounded-xl border transition-all duration-200 snap-start
                                ${isSelected
                                    ? 'bg-slate-900 border-slate-900 text-white shadow-md scale-105'
                                    : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-200 hover:bg-slate-50'}
                            `}
                        >
                            <span className={`text-[10px] font-bold uppercase mb-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                                {idx === 0 ? 'Today' : item.dayName}
                            </span>
                            <span className={`text-lg font-[800] mb-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                {safeDayNum}
                            </span>
                            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                        </button>
                    );
                })}
            </div>

            {/* 2. Active Preview Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${selectedItem.date}-${direction}`} // Re-render on day OR direction change
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    <Link
                        href={`/stats/vancouver-to-seattle/${selectedItem.slug}`}
                        className="block group bg-white border border-slate-200 p-4 rounded-2xl hover:shadow-lg hover:border-indigo-300 transition-all text-left relative overflow-hidden active:scale-[0.99]"
                    >
                        {/* Compact Top Row */}
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2.5">
                                <div className={`p-2 rounded-lg ${style.iconBg} ${style.iconColor}`}>
                                    <Icon className="w-4 h-4" strokeWidth={3} />
                                </div>
                                <div className="leading-none">
                                    <h4 className="font-[800] text-slate-900 text-sm md:text-base uppercase tracking-tight">
                                        {selectedItem.dayLabel.split(',')[0]}
                                    </h4>
                                    <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase mt-0.5">
                                        {selectedItem.dayLabel.split(',')[1]}
                                    </p>
                                </div>
                            </div>

                            {/* Badge */}
                            {selectedItem.impactBadge && (
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.badgeBg} ${style.badgeText}`}>
                                    {selectedItem.impactBadge}
                                </span>
                            )}
                            {!selectedItem.impactBadge && selectedItem.status === 'green' && (
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                    Smooth
                                </span>
                            )}
                        </div>

                        {/* Updated Data Grid: Compact */}
                        <div className="flex items-center gap-2">
                            {/* Left: Worst Time */}
                            <div className="bg-slate-50 flex-1 rounded-lg px-3 py-2 border border-slate-100/50">
                                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                    Worst Time
                                </span>
                                <span className="block text-xs md:text-sm font-bold text-slate-800 truncate mt-0.5">
                                    {selectedItem.worstTime}
                                </span>
                            </div>

                            {/* Right: Strategy / Message */}
                            <div className="bg-slate-50 flex-1 rounded-lg px-3 py-2 border border-slate-100/50 flex flex-col justify-center">
                                {selectedItem.impactBadge ? (
                                    <span className="block text-xs md:text-sm font-bold text-indigo-600 flex items-center gap-1">
                                        Read Forecast
                                    </span>
                                ) : (
                                    <span className="block text-xs md:text-sm font-bold text-slate-800 truncate">
                                        Read Forecast
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="absolute top-1/2 -translate-y-1/2 right-3 text-slate-300 opacity-50 group-hover:translate-x-1 group-hover:text-indigo-400 transition-all">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </Link>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
