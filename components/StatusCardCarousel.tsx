'use client';

import { StatusCard } from "@/components/StatusCard";
import { BorderEvent } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDirection } from "@/context/DirectionContext";
import { ExchangeRateBadge } from "@/components/ExchangeRateBadge";

export function StatusCardCarousel({ events, updatedAt }: { events: BorderEvent[], updatedAt?: string }) {
    const { direction } = useDirection();
    const [activeIndex, setActiveIndex] = useState(0);

    // Filter events based on active direction
    // Note: If event.direction is missing (old data), assume SOUTHBOUND to be safe
    const filteredEvents = events.filter(e =>
        (e.direction || "SOUTHBOUND") === direction
    );

    // Sort to ensure consistent order (e.g. PA, PH, Lyn)
    // We can sort by id or title to prevent jumping
    const sortedEvents = [...filteredEvents].sort((a, b) => a.id.localeCompare(b.id));

    // Format timestamp
    const formatTime = (isoString?: string) => {
        if (!isoString) return "";
        try {
            const date = new Date(isoString);
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        } catch {
            return "";
        }
    };

    const timeStr = formatTime(updatedAt);

    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!sortedEvents) return;
        const container = containerRef.current; // Use specific ref for scroll container
        if (!container) return;

        const handleScroll = () => {
            if (sortedEvents.length === 0) return;
            const scrollCenter = container.scrollLeft + (container.clientWidth / 2);
            const cardWidth = container.scrollWidth / sortedEvents.length;
            const newIndex = Math.floor(scrollCenter / cardWidth);
            const clampedIndex = Math.max(0, Math.min(sortedEvents.length - 1, newIndex));
            setActiveIndex(clampedIndex);
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => container.removeEventListener('scroll', handleScroll);
    }, [sortedEvents]);

    return (
        <div className="flex flex-col gap-2 md:gap-6">
            {/* Context Header: Simplified Direction Title */}
            <div className="relative flex flex-col justify-center items-center -mt-2 pb-2 md:pb-0">
                <h2 className="text-xl md:text-2xl font-[900] text-slate-900 tracking-tight text-center">
                    {direction === "SOUTHBOUND" ? "Southbound Live Traffic" : "Northbound Live Traffic"}
                </h2>
                {timeStr && (
                    <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Updated at {timeStr}
                    </span>
                )}
                <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2">
                    <ExchangeRateBadge />
                </div>
            </div>



            {/* Mobile: Carousel / Desktop: Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={direction}
                    initial={{ opacity: 0, rotateX: 90 }}
                    animate={{ opacity: 1, rotateX: 0 }}
                    exit={{ opacity: 0, rotateX: -90 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                >
                    <div
                        ref={containerRef}
                        className="flex overflow-x-auto snap-x snap-mandatory pt-20 -mt-20 pb-4 -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:pt-0 md:mt-0 md:pb-0 md:mx-0 md:px-0 gap-4 mb-2 md:mb-12 scrollbar-hide perspective-1000"
                    >
                        {sortedEvents.map((event) => (
                            <div key={event.id} className="min-w-[80vw] sm:min-w-[380px] md:min-w-0 snap-center h-full">
                                <StatusCard event={event} />
                            </div>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Mobile Carousel Dots */}
            <div className="flex justify-center gap-2 mb-6 md:hidden">
                {sortedEvents.map((_, i) => (
                    <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${i === activeIndex ? 'bg-indigo-600 scale-125' : 'bg-slate-200'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
