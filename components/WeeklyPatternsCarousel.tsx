'use client';

import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import React from 'react';

export interface PatternItem {
    day: string;
    slug: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    badge: string;
}

export function WeeklyPatternsCarousel({ items }: { items: PatternItem[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Triple the items to create a buffer (Start buffer | Middle (visible) | End buffer)
    const tripleItems = [...items, ...items, ...items];

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        // Wait for layout to settle to calculate widths accurately
        const initScroll = () => {
            // Calculate width of one set (Total / 3)
            const totalWidth = container.scrollWidth;
            const oneSetWidth = totalWidth / 3;

            // Start in the middle set
            if (container.scrollLeft < 100) { // Only set if not already scrolled (approx)
                container.scrollLeft = oneSetWidth;
            }
        };

        // Initial setup
        initScroll();

        const handleScroll = () => {
            const totalWidth = container.scrollWidth;
            const oneSetWidth = totalWidth / 3;
            const currentScroll = container.scrollLeft;
            const width = container.clientWidth;

            // Infinite Scroll Logic:
            // If we scroll into the first set (buffer), jump forward to the middle set.
            // If we scroll into the third set (buffer), jump backward to the middle set.
            // Tolerance: We use a small buffer (e.g., 20px) or check if we cross the boundary.

            // Boundary 1: Near 0 (Start of Set 1)
            if (currentScroll <= 10) {
                container.scrollLeft = oneSetWidth + currentScroll;
            }
            // Boundary 2: Near End of Set 2 (Start of Set 3)
            // When currentScroll + clientWidth >= oneSetWidth * 2
            else if (currentScroll >= (oneSetWidth * 2) - width) {
                container.scrollLeft = currentScroll - oneSetWidth;
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [items]);

    return (
        <>
            {/* Mobile Infinite Carousel */}
            <div
                ref={scrollRef}
                className="md:hidden flex overflow-x-auto snap-x snap-mandatory pb-8 -mx-4 px-4 gap-4 scrollbar-hide"
            >
                {tripleItems.map((item, index) => (
                    <div key={`${item.day}-${index}`} className="min-w-[75vw] sm:min-w-[280px] snap-center h-full flex-shrink-0">
                        <Link
                            prefetch={false}
                            href={`/stats/vancouver-to-seattle/${item.slug}`}
                            className="group bg-white border border-slate-200 p-5 rounded-2xl hover:shadow-md hover:border-indigo-300 transition-all text-left relative overflow-hidden flex flex-col h-full w-full"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className={`p-2 rounded-lg transition-colors bg-${item.color}-50 text-${item.color}-600 group-hover:bg-${item.color}-100`}>
                                    {item.icon}
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full transition-colors bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600`}>
                                    {item.badge}
                                </span>
                            </div>

                            <h4 className="font-[800] text-slate-900 mb-1 group-hover:text-indigo-700 transition-colors">{item.title}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-grow">{item.description}</p>

                            {/* Click Affordance */}
                            <div className="flex items-center text-xs font-bold text-indigo-600 opacity-60 group-hover:opacity-100 transition-opacity mt-auto">
                                View Analysis <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Desktop Grid (Standard) */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {items.map((item) => (
                    <Link
                        key={item.day}
                        prefetch={false}
                        href={`/stats/vancouver-to-seattle/${item.slug}`}
                        className="group bg-white border border-slate-200 p-5 rounded-2xl hover:shadow-md hover:border-indigo-300 transition-all text-left relative overflow-hidden flex flex-col h-full w-full"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className={`p-2 rounded-lg transition-colors bg-${item.color}-50 text-${item.color}-600 group-hover:bg-${item.color}-100`}>
                                {item.icon}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full transition-colors bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600`}>
                                {item.badge}
                            </span>
                        </div>

                        <h4 className="font-[800] text-slate-900 mb-1 group-hover:text-indigo-700 transition-colors">{item.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-grow">{item.description}</p>

                        <div className="flex items-center text-xs font-bold text-indigo-600 opacity-60 group-hover:opacity-100 transition-opacity mt-auto">
                            View Analysis <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );
}
