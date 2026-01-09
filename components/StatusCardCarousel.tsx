'use client';

import { StatusCard } from "@/components/StatusCard";
import { BorderEvent } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDirection } from "@/context/DirectionContext";
import { DirectionTabs } from "@/components/DirectionTabs";
import { ExchangeRateBadge } from "@/components/ExchangeRateBadge";

export function StatusCardCarousel({ events }: { events: BorderEvent[] }) {
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
            {/* Inline Direction Tabs (Option 2) */}
            <DirectionTabs />

            {/* Context Header: Simplified Direction Title */}
            <div className="relative flex justify-center items-center -mt-2 pb-2 md:pb-0">
                <h2 className="text-xl md:text-2xl font-[900] text-slate-900 tracking-tight text-center">
                    {direction === "SOUTHBOUND" ? "Southbound Traffic" : "Northbound Traffic"}
                </h2>
                <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2">
                    <ExchangeRateBadge />
                </div>
            </div>

            {/* Mobile-only badge placement */}
            <div className="flex md:hidden justify-center -mt-2 mb-2">
                <ExchangeRateBadge />
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
                        className="flex overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:pb-0 md:mx-0 md:px-0 gap-4 mb-2 md:mb-12 scrollbar-hide perspective-1000"
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
