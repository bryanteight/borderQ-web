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

    // Hide Plan Ahead widget for Northbound until data collection is complete
    if (direction === 'NORTHBOUND') return null;

    const detailSlug = 'vancouver-to-seattle';
    const detailQuery = '';

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

            {/* Main Container - Responsive Layout */}
            <div className="flex flex-col lg:flex-row gap-6 items-stretch">

                {/* 1. Day Navigation */}
                {/* Mobile: Horizontal Strip | Desktop: Vertical Sidebar */}
                <div className="lg:w-56 flex-none">
                    <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-hide gap-3 snap-x">
                        {items.map((item, idx) => {
                            const isSelected = idx === selectedIndex;
                            const dateParts = item.date.split('-');
                            const safeDayNum = parseInt(dateParts[2]);

                            // Status colors
                            const statusColors: Record<string, string> = {
                                red: "bg-rose-500 shadow-rose-200",
                                yellow: "bg-amber-400 shadow-amber-200",
                                green: "bg-emerald-400 shadow-emerald-200"
                            };
                            const dotColor = statusColors[item.status] || "bg-slate-300";

                            return (
                                <button
                                    key={item.date}
                                    onClick={() => setSelectedIndex(idx)}
                                    className={`
                                        relative group transition-all duration-200 snap-start
                                        
                                        /* Mobile: Boxy Vertical Pill */
                                        flex flex-col items-center justify-center 
                                        w-14 h-20 flex-shrink-0 rounded-2xl border
                                        
                                        /* Desktop: Wide Horizontal Row */
                                        lg:w-full lg:h-auto lg:flex-row lg:justify-between lg:px-4 lg:py-3 lg:rounded-xl
                                        
                                        ${isSelected
                                            ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200/50 scale-105 lg:scale-100 lg:translate-x-2'
                                            : 'bg-white border-slate-200/60 text-slate-500 hover:border-indigo-300 hover:bg-indigo-50/30'}
                                    `}
                                >
                                    {/* Content Wrapper for flex layout difference */}
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3 lg:w-full">

                                        {/* Day Name (MON) */}
                                        <span className={`text-[10px] lg:text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                                            {idx === 0 ? 'Today' : item.dayName}
                                        </span>

                                        {/* Date Number (14) */}
                                        <span className={`text-xl lg:text-sm font-[900] leading-none my-1 lg:my-0 lg:ml-auto ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                            {safeDayNum}
                                        </span>

                                        {/* Status Dot - Mobile: Absolute Bottom Left (Now Centered via negative margin hack or flex) */}
                                        {/* Better approach: Just use absolute positioning for precise placement on mobile pill */}
                                        <div className={`
                                            w-2 h-2 rounded-full shadow-sm ${dotColor}
                                            
                                            /* Mobile: Horizontally centered at the bottom */
                                            absolute bottom-2 left-1/2 -translate-x-1/2
                                            
                                            /* Desktop: Reset to static/order */
                                            lg:static lg:translate-x-0 lg:order-first lg:w-2 lg:h-2
                                        `} />
                                    </div>

                                    {/* Active Indicator (Desktop Arrow) */}
                                    {isSelected && (
                                        <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-900 rotate-45 rounded-sm" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 2. Forecast Card (Right Panel) */}
                <div className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${selectedItem.date}-${direction}`}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            <Link
                                href={`/stats/${detailSlug}/${selectedItem.slug}${detailQuery}`}
                                className="h-full flex flex-col relative group bg-white border border-slate-200/60 p-6 lg:p-8 rounded-[2rem] hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-200 transition-all duration-300 active:scale-[0.99] overflow-hidden"
                            >
                                {/* Background Decor */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-white rounded-bl-[4rem] -z-10 opacity-50" />

                                {/* Header Section */}
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                                    {/* Icon & Title */}
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3.5 rounded-2xl ${style.iconBg} ${style.iconColor} shadow-sm ring-1 ring-inset ring-black/5`}>
                                            <Icon className="w-6 h-6" strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h4 className="font-[900] text-slate-900 text-xl lg:text-2xl uppercase tracking-tight leading-none mb-1.5">
                                                {selectedItem.dayLabel.split(',')[0]}
                                            </h4>
                                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wide flex items-center gap-2">
                                                {selectedItem.dayLabel.split(',')[1]}
                                                {selectedItem.impactBadge && (
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${style.badgeBg} ${style.badgeText}`}>
                                                        {selectedItem.impactBadge}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Worst Time Pill */}
                                    <div className="self-start bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                                            Worst Time
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                            <span className="text-sm font-black text-slate-800">
                                                {selectedItem.worstTime}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Area: AI Insight */}
                                <div className="flex-1 bg-slate-50/80 rounded-2xl p-5 border border-slate-100 relative group-hover:bg-indigo-50/30 transition-colors">
                                    <div className="flex gap-3">
                                        <div className="mt-1">
                                            {/* AI Sparkle Icon */}
                                            <svg className="w-4 h-4 text-indigo-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 2L14.39 9.61L22 12L14.39 14.39L12 22L9.61 14.39L2 12L9.61 9.61L12 2Z" fill="currentColor" className="animate-pulse" />
                                            </svg>
                                        </div>
                                        <div className="text-sm lg:text-[15px] font-medium text-slate-600 leading-relaxed font-mono w-full">
                                            <TypewriterText
                                                text={selectedItem.smart_analysis
                                                    ? `${selectedItem.smart_analysis.intro} ${selectedItem.smart_analysis.savings_analysis}`
                                                    : "Forecast analysis is improving. Check back shortly for detailed insights."}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Footer CTA */}
                                <div className="mt-5 flex justify-end items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                                        See Hourly Chart
                                    </span>
                                    <div className="bg-indigo-100 p-1.5 rounded-full text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <ArrowRight className="w-3 h-3" />
                                    </div>
                                </div>

                            </Link>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

// Sub-component for Typewriter effect
function TypewriterText({ text }: { text: string }) {
    const [displayed, setDisplayed] = useState("");

    useEffect(() => {
        setDisplayed("");
        let i = 0;
        const speed = 20; // ms per char

        // Correct implementation
        const intervalId = setInterval(() => {
            setDisplayed((prev) => {
                if (prev.length < text.length) {
                    return prev + text.charAt(prev.length);
                }
                clearInterval(intervalId);
                return prev;
            });
        }, speed);

        return () => clearInterval(intervalId);
    }, [text]);

    return (
        <span>
            {displayed}
            <span className="animate-pulse ml-0.5 text-indigo-400 opacity-70">|</span>
        </span>
    );
}
