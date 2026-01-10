"use client";

import { EventAlert } from "@/lib/types";
import { ExternalLink } from "lucide-react";
import { clsx } from "clsx";

interface EventBannerProps {
    event: EventAlert;
}

// Color mapping for each warning level (white background theme)
const LEVEL_STYLES = {
    CRITICAL: {
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-700",
        icon: "🚨",
        dot: "bg-red-500",
    },
    WARNING: {
        bg: "bg-orange-50",
        border: "border-orange-200",
        text: "text-orange-700",
        icon: "⚠️",
        dot: "bg-orange-500",
    },
    ADVISORY: {
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-700",
        icon: "📅",
        dot: "bg-amber-500",
    },
    INFO: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-700",
        icon: "ℹ️",
        dot: "bg-blue-500",
    },
};

/**
 * Formats hours into a human-readable string
 * e.g., 2.5 -> "2h 30m", 48 -> "2 days", 0.5 -> "30m"
 */
function formatTimeUntil(hours: number): string {
    if (hours < 1) {
        return `${Math.round(hours * 60)}m`;
    }
    if (hours < 24) {
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);
        return m > 0 ? `${h}h ${m}m` : `${h}h`;
    }
    const days = Math.round(hours / 24);
    return days === 1 ? "1 day" : `${days} days`;
}

export function EventBanner({ event }: EventBannerProps) {
    const styles = LEVEL_STYLES[event.level];

    // Calculate time until event ends
    const timeUntilEnd = formatTimeUntil(event.hours_until_end);

    const content = (
        <div
            className={clsx(
                "relative flex items-start gap-3 md:gap-4 px-4 py-3 rounded-xl border shadow-sm text-left",
                "transition-all duration-200 hover:shadow-md",
                styles.bg,
                styles.border
            )}
        >
            {/* Icon Container with Badge */}
            <div className="relative shrink-0 mt-0.5">
                <span className="text-xl md:text-2xl leading-none block">{styles.icon}</span>

                {/* Pulsing Badge */}
                {(event.level === "CRITICAL" || event.level === "WARNING") && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className={clsx("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", styles.dot)}></span>
                        <span className={clsx("relative inline-flex rounded-full h-3 w-3 border-2 border-white", styles.dot)}></span>
                    </span>
                )}
            </div>

            {/* Content Column */}
            <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                    <h3 className={clsx("font-bold text-sm md:text-base leading-tight pr-6 md:pr-0", styles.text)}>
                        {event.name}
                    </h3>

                    {/* Desktop Timer (Inline) */}
                    <span className="hidden md:inline-flex items-center gap-2 text-slate-500 text-sm">
                        <span>·</span>
                        Ends in {timeUntilEnd}
                    </span>
                </div>

                {/* Mobile Timer (Below Title) */}
                <div className="md:hidden text-xs font-medium text-slate-500 mt-1">
                    Ends in {timeUntilEnd}
                </div>
            </div>

            {/* External Icon (Top Right absolute on mobile, inline on desktop handled by layout) */}
            {event.url && (
                <ExternalLink className={clsx("absolute top-3 right-3 md:static md:opacity-60 w-4 h-4", styles.text)} />
            )}
        </div>
    );

    // Wrap in link if URL is available
    if (event.url) {
        return (
            <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
            >
                {content}
            </a>
        );
    }

    return content;
}
