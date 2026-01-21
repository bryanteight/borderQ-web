"use client";

import { useState, useEffect } from "react";
import { EventAlert } from "@/lib/types";
import { clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";

interface EventBannerProps {
    event: EventAlert;
}

// Color mapping for each warning level (white background theme)
const LEVEL_STYLES = {
    CRITICAL: {
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-900", // Darker for readability
        title: "text-red-700",
    },
    WARNING: {
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-900",
        title: "text-amber-720", // Custom amber
    },
    ADVISORY: { // Default (Sports/Concerts)
        bg: "bg-amber-50",
        border: "border-amber-200/60",
        text: "text-amber-900",
        title: "text-amber-800",
    },
    INFO: {
        bg: "bg-slate-50",
        border: "border-slate-200",
        text: "text-slate-700",
        title: "text-slate-900",
    },
};

/**
 * Formats hours into a human-readable string
 */
function formatTimeUntil(hours: number): string {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours < 24) {
        const h = Math.floor(hours);
        return h === 1 ? "1h" : `${h}h`;
    }
    const days = Math.round(hours / 24);
    return days === 1 ? "1 day" : `${days} days`;
}

export function EventBanner({ event }: EventBannerProps) {
    const [isVisible, setIsVisible] = useState(false);
    const styles = LEVEL_STYLES[event.level] || LEVEL_STYLES.ADVISORY;

    // Parse event start date for the calendar icon
    // Using starts_at string from backend (e.g. "2026-01-16T19:00:00")
    const eventDate = new Date(event.starts_at);
    // Use explicit locale/timezone handling if possible, or fallback to visual date
    const dayNameStr = eventDate.toLocaleString('default', { month: 'short' });
    const dateNum = eventDate.getDate();

    // Logic for "Starts in" vs "Ends in"
    // If hours_until is positive, it hasn't started -> "Starts in X"
    // If hours_until is negative, it has started -> "Ends in Y" (using hours_until_end)
    let timeLabel = "";
    let timeValue = "";

    if (event.hours_until > 0) {
        timeLabel = "Starts in";
        timeValue = formatTimeUntil(event.hours_until);
    } else {
        timeLabel = "Ends in";
        timeValue = formatTimeUntil(event.hours_until_end);
    }

    useEffect(() => {
        // Delay appearance by 3 seconds
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="overflow-hidden"
                >
                    <div
                        className={clsx(
                            "relative flex items-center gap-3 md:gap-4 px-4 py-3 rounded-xl border shadow-sm text-left mb-4",
                            styles.bg,
                            styles.border
                        )}
                    >
                        {/* Calendar Icon Badge */}
                        <div className="shrink-0 flex flex-col items-center justify-center w-10 h-10 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden text-center">
                            <div className="w-full bg-red-800/80 h-3"></div> {/* Red Top Bar */}
                            <div className="flex flex-col leading-none py-1">
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{dayNameStr}</span>
                                <span className="text-sm font-[900] text-slate-700">{dateNum}</span>
                            </div>
                        </div>

                        {/* Content Column */}
                        <div className="flex-1 min-w-0">
                            <h3 className={clsx("font-[800] text-sm md:text-base leading-tight mb-0.5", styles.title)}>
                                {event.name}
                            </h3>
                            <div className={clsx("text-xs font-medium opacity-80", styles.text)}>
                                {timeLabel} {timeValue}
                            </div>
                            {event.description && (
                                <p className={clsx("text-xs mt-1.5 leading-snug font-medium opacity-100", styles.text)}>
                                    {event.description}
                                </p>
                            )}
                        </div>

                        {/* Optional: Small 'Pop Out' Icon (Non-clickable, visual only) */}


                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
