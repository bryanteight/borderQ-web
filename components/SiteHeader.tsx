import React from 'react';
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

export function SiteHeader() {
    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-white sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                {/* Logo Section */}
                <div className="flex items-center gap-1">
                    <Link href="/" className="flex flex-col hover:opacity-90 transition-opacity">
                        <span className="flex items-center font-[800] text-2xl sm:text-3xl tracking-tight text-slate-900 leading-none">
                            Border
                            <BorderQLogo className="w-8 h-8 sm:w-10 sm:h-10 -ml-1 mb-1" />
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase ml-1">Traffic AI</span>
                    </Link>
                </div>

                {/* Right: Region Selector (Top Right) */}
                <div className="flex items-center">
                    <RegionSelector tabs={regionTabs} />
                </div>
            </div>
        </header>
    );
}
