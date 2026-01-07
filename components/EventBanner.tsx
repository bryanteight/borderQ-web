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
                "flex items-center justify-center gap-3 px-4 py-3 rounded-xl border shadow-sm",
                "transition-all duration-200 hover:shadow-md",
                styles.bg,
                styles.border
            )}
        >
            {/* Pulsing dot for CRITICAL/WARNING */}
            {(event.level === "CRITICAL" || event.level === "WARNING") && (
                <div className={clsx("w-2 h-2 rounded-full animate-pulse", styles.dot)} />
            )}

            {/* Icon */}
            <span className="text-lg">{styles.icon}</span>

            {/* Event Info */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
                <span className={clsx("font-bold text-sm", styles.text)}>
                    {event.name}
                </span>
                <span className="text-slate-400 text-sm">·</span>
                <span className="text-slate-600 text-sm font-medium">
                    Ends in {timeUntilEnd}
                </span>
            </div>

            {/* External link icon if URL available */}
            {event.url && (
                <ExternalLink className={clsx("w-4 h-4 opacity-60", styles.text)} />
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
