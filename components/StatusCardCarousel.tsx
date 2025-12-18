'use client';

import { StatusCard } from "@/components/StatusCard";
import { BorderEvent } from "@/lib/types";
import { useEffect, useRef, useState } from "react";

export function StatusCardCarousel({ events }: { events: BorderEvent[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const eventsLength = events?.length || 0;

    useEffect(() => {
        if (!events) return;
        const container = scrollRef.current;
        if (!container) return;

        const handleScroll = () => {
            // Calculate active index based on scroll position center point
            const scrollCenter = container.scrollLeft + (container.clientWidth / 2);
            /* Avoid division by zero if events is empty or not rendered */
            if (events.length === 0) return;

            const cardWidth = container.scrollWidth / events.length;

            const newIndex = Math.floor(scrollCenter / cardWidth);
            // Clamp index to valid range
            const clampedIndex = Math.max(0, Math.min(events.length - 1, newIndex));

            setActiveIndex(clampedIndex);
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        // Initial check
        handleScroll();

        return () => container.removeEventListener('scroll', handleScroll);
    }, [events.length]);

    return (
        <>
            {/* Mobile: Carousel / Desktop: Grid */}
            <div
                ref={scrollRef}
                className="flex overflow-x-auto snap-x snap-mandatory pb-8 -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:pb-0 md:mx-0 md:px-0 gap-4 mb-4 md:mb-12 scrollbar-hide"
            >
                {events.map((event) => (
                    <div key={event.id} className="min-w-[80vw] sm:min-w-[380px] md:min-w-0 snap-center">
                        <StatusCard event={event} />
                    </div>
                ))}
            </div>

            {/* Mobile Carousel Dots (Dynamic) */}
            <div className="flex justify-center gap-2 mb-12 md:hidden">
                {events.map((_, i) => (
                    <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${i === activeIndex ? 'bg-indigo-600 scale-125' : 'bg-slate-200'
                            }`}
                    />
                ))}
            </div>
        </>
    );
}
