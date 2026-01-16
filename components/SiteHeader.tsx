import React, { Suspense } from 'react';
import Link from "next/link";
import { BorderQLogo } from "@/components/BorderQLogo";
import { RegionSelector } from "@/components/RegionSelector";

// TODO: In a real app, this state should be managed globally (Context or URL params)
// For now, we mirror the static tabs from page.tsx to keep the UI functional visually.
const regionTabs = [
    { id: 'seattle', label: 'BC / WA', active: true, comingSoon: false },
    { id: 'niagara', label: 'Niagara / NY', active: false, comingSoon: true },
    { id: 'detroit', label: 'Detroit / Windsor', active: false, comingSoon: true },
];

// Imports cleaned up
import { CompactDirectionToggle } from "./CompactDirectionToggle";

// ... existing state ...

export function SiteHeader() {
    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
                {/* Logo Section */}
                <div className="flex items-center gap-1 shrink-0">
                    <Link href="/" className="flex flex-col hover:opacity-90 transition-opacity">
                        <span className="flex items-center font-[800] text-xl sm:text-2xl md:text-3xl tracking-tight text-slate-900 leading-none">
                            Border
                            <BorderQLogo className="w-6 h-6 sm:w-8 sm:h-8 sm:w-10 sm:h-10 -ml-1 mb-1" />
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-1">Traffic AI</span>
                    </Link>
                </div>

                {/* Right Controls: Direction Toggle + Region Selector */}
                <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
                    {/* Direction Toggle (Moved from page body) */}
                    <div className="hidden sm:block">
                        <Suspense fallback={<div className="w-[200px] h-[36px] bg-slate-100 rounded-lg animate-pulse" />}>
                            <CompactDirectionToggle />
                        </Suspense>
                    </div>
                    {/* Mobile: Simple Toggle (Maybe icon based?) -> Stick to compact toggle for now */}

                    {/* Region Selector */}
                    <div className="flex items-center pl-4 border-l border-slate-200">
                        <RegionSelector tabs={regionTabs} />
                    </div>
                </div>
            </div>

            {/* Mobile-Only Direction Toggle Row (Below Header) */}
            <div className="sm:hidden border-b border-slate-50 bg-white/50 backdrop-blur-sm px-4 py-2 flex justify-center">
                <Suspense fallback={<div className="w-[200px] h-[36px] bg-slate-100 rounded-lg animate-pulse" />}>
                    <CompactDirectionToggle />
                </Suspense>
            </div>
        </header>
    );
}
