'use client';

import { ArrowRight, TrendingUp, Sun as LucideSun, Calendar, Star, Ticket } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PlanningData } from "@/lib/types";
import { useDirection } from "@/context/DirectionContext";
import { useTranslations } from "next-intl";

// Custom Filled Sun Icon for Brand Alignment
const CustomSun = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
    >
        {/* Solid Center */}
        <circle cx="12" cy="12" r="6.5" fill="currentColor" />

        {/* Thickness Rays */}
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="M4.93 4.93l1.41 1.41" />
            <path d="M17.66 17.66l1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="M6.34 17.66l-1.41 1.41" />
            <path d="M19.07 4.93l-1.41 1.41" />
        </g>
    </svg>
);

function parseAIReport(html: string): { summary: string; timing: string } {
    if (!html) return { summary: '', timing: '' };

    // The DSPy output always uses <p> tags for the sections.
    // 1st <p> is Summary, 2nd <p> is Smart Timing
    const paragraphs = html.match(/<p>[^]*?<\/p>/gi) || [];

    const cleanText = (val: string) => val.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

    const summaryRaw = paragraphs[0] || '';
    const timingRaw = paragraphs[1] || '';

    // Strip the very first <strong>...</strong> block which contains the label (e.g., "Summary:" or "总结：")
    const stripPrefix = (htmlStr: string) => cleanText(htmlStr.replace(/^<p>\s*<strong>[^<]+<\/strong>\s*/i, ''));

    const summary = stripPrefix(summaryRaw).slice(0, 150);
    const timing = stripPrefix(timingRaw).slice(0, 150);

    return { summary, timing };
}

export function PlanAheadWidget({ planning }: { planning: { SOUTHBOUND: PlanningData[], NORTHBOUND: PlanningData[] } }) {
    const { direction } = useDirection();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const t = useTranslations('PlanAhead');

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
                badgeBg: "bg-amber-500",
                badgeText: "text-white",
                iconBg: "bg-amber-500 shadow-md shadow-amber-200",
                iconColor: "text-white"
            };
        }
        if (item.status === 'red') {
            return {
                icon: TrendingUp,
                color: "rose",
                badgeBg: "bg-rose-500",
                badgeText: "text-white",
                iconBg: "bg-rose-500 shadow-md shadow-rose-200",
                iconColor: "text-white"
            };
        }
        if (item.status === 'yellow') {
            return {
                icon: Calendar,
                color: "orange",
                badgeBg: "bg-orange-500",
                badgeText: "text-white",
                iconBg: "bg-orange-500 shadow-md shadow-orange-200",
                iconColor: "text-white"
            };
        }
        // Green
        return {
            icon: CustomSun,
            color: "emerald",
            badgeBg: "bg-emerald-500", // Solid Green
            badgeText: "text-white",   // White text
            iconBg: "bg-emerald-500 shadow-md shadow-emerald-200", // Solid Green BG
            iconColor: "text-white"           // White Icon
        };
    };

    const style = getCardStyles(selectedItem);
    const Icon = style.icon;

    // Hide Plan Ahead widget for Northbound until data collection is complete
    if (direction === 'NORTHBOUND') return null;

    const detailSlug = direction === 'SOUTHBOUND' ? 'vancouver-to-seattle' : 'seattle-to-vancouver';

    return (
        <div className="w-full mb-6">
            {/* Header - Prominent with Shining Effect */}
            <div className="flex items-center justify-center sm:justify-between mb-5 px-1 mt-2">
                <h3 className="text-2xl font-[900] tracking-tight relative inline-block">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 animate-gradient-x bg-[length:200%_auto]">
                        {t('title')}
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
                                            {idx === 0 ? t('today') : item.dayName}
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
                                href={`/forecast/${detailSlug}/${selectedItem.date}`}
                                className="h-full flex flex-col relative group bg-white border border-slate-200/60 p-6 lg:p-8 rounded-[2rem] hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-200 transition-all duration-300 active:scale-[0.99] overflow-hidden"
                            >
                                {/* Background Decor */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-white rounded-bl-[4rem] -z-10 opacity-50" />

                                {/* Header Section */}
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                                    {/* Icon & Title */}
                                    <div className="flex items-start gap-5">
                                        <div className={`w-14 h-14 flex items-center justify-center rounded-[1.2rem] ${style.iconBg} ${style.iconColor} shadow-sm ring-1 ring-inset ring-black/5 transition-transform group-hover:scale-105 duration-300`}>
                                            <Icon className="w-7 h-7" strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h4 className="font-[900] text-slate-900 text-xl lg:text-2xl uppercase tracking-tight leading-none mb-1.5">
                                                {selectedItem.dayLabel.split(',')[0]}
                                            </h4>
                                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wide flex items-center gap-3 mt-1">
                                                {selectedItem.dayLabel.split(',')[1]}
                                                {selectedItem.impactBadge && (
                                                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm text-[10px] font-[800] tracking-wide">
                                                        <Ticket className="w-3 h-3 text-emerald-500 fill-emerald-50" />
                                                        {selectedItem.impactBadge}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stats Column: Worst Time & Confidence */}
                                    <div className="self-start flex flex-col gap-2 items-end">
                                        <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 shadow-sm w-full">
                                            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                                                {t('worstTime')}
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                                <span className="text-sm font-black text-slate-800">
                                                    {selectedItem.worstTime}
                                                </span>
                                            </div>
                                        </div>


                                    </div>
                                </div>

                                {/* Content Area: AI Insight - Two Sections */}
                                <div className="flex-1 bg-slate-50/80 rounded-2xl p-5 border border-slate-100 relative group-hover:bg-indigo-50/30 transition-colors">
                                    {selectedItem.html_report ? (() => {
                                        const { summary, timing } = parseAIReport(selectedItem.html_report);
                                        return (
                                            <div className="space-y-4">
                                                {/* Summary Section */}
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <svg className="w-4 h-4 text-indigo-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12 2L14.39 9.61L22 12L14.39 14.39L12 22L9.61 14.39L2 12L9.61 9.61L12 2Z" fill="currentColor" className="animate-pulse" />
                                                        </svg>
                                                        <span className="text-sm font-black text-slate-800 uppercase tracking-wide">{t('summary')}</span>
                                                    </div>
                                                    <p className="text-base lg:text-lg font-semibold text-slate-700 leading-relaxed">
                                                        <TypewriterText text={summary || t('loadingSummary')} />
                                                    </p>
                                                </div>

                                                {/* Smart Timing Section */}
                                                <div className="pt-3 border-t border-slate-200">
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                                            <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                        </svg>
                                                        <span className="text-sm font-black text-emerald-700 uppercase tracking-wide">{t('smartTiming')}</span>
                                                    </div>
                                                    <p className="text-base lg:text-lg font-semibold text-slate-700 leading-relaxed">
                                                        <TypewriterText text={timing || t('loadingTiming')} />
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })() : (
                                        <div className="text-base font-medium text-slate-500">
                                            {t('loadingAi')}
                                        </div>
                                    )}
                                </div>

                                {/* Footer CTA */}
                                <div className="mt-5 flex justify-end items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                                        {t('seeDetail')}
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
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        setDisplayed("");
        setIsTyping(true);
        const speed = 20; // ms per char

        // Correct implementation
        const intervalId = setInterval(() => {
            setDisplayed((prev) => {
                if (prev.length < text.length) {
                    return prev + text.charAt(prev.length);
                }
                clearInterval(intervalId);
                setIsTyping(false);
                return prev;
            });
        }, speed);

        return () => clearInterval(intervalId);
    }, [text]);

    return (
        <span>
            {displayed}
            {isTyping && <span className="animate-pulse ml-0.5 text-indigo-400 opacity-70">|</span>}
        </span>
    );
}
