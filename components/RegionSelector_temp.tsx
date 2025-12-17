"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { clsx } from "clsx";

type RegionTab = {
    id: string;
    label: string;
    active: boolean;
    comingSoon?: boolean;
};

export function RegionSelector({ tabs }: { tabs: RegionTab[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const activeTab = tabs.find((t) => t.active) || tabs[0];

    return (
        <div className="w-full max-w-3xl mx-auto px-1 relative z-20">
            <div className="flex items-center justify-between">
                {/* Left: Static Label */}
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">
                    Select Region
                </h2>

                {/* Right: Glassy Trigger */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={clsx(
                        "relative flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300",
                        "bg-white/60 backdrop-blur-md border border-white/40 shadow-sm",
                        "hover:bg-white/80 hover:shadow-md hover:scale-[1.02]",
                        "active:scale-95"
                    )}
                >
                    <span className="text-[11px] font-[800] text-indigo-600 uppercase tracking-wide">
                        {activeTab.label}
                    </span>
                    <ChevronDown
                        className={clsx(
                            "w-3.5 h-3.5 text-indigo-400 transition-transform duration-300",
                            isOpen && "rotate-180"
                        )}
                    />
                </button>
            </div>

            {/* Dropdown Menu (Absolute) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute top-full right-0 mt-2 w-48 z-50 origin-top-right"
                    >
                        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl overflow-hidden p-1.5 ring-1 ring-black/5">
                            <div className="flex flex-col gap-0.5">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        disabled={tab.comingSoon}
                                        onClick={() => {
                                            if (!tab.comingSoon) setIsOpen(false);
                                            // Navigation would go here in a real app, 
                                            // but currently page.tsx handles selection via props/mock state.
                                            // Since this is just a UI visual for now (based on page.tsx code),
                                            // we'll just close.
                                        }}
                                        className={clsx(
                                            "flex items-center justify-between w-full px-3 py-2 rounded-xl text-left transition-colors text-xs font-bold",
                                            tab.active
                                                ? "bg-indigo-50 text-indigo-700"
                                                : "text-slate-600 hover:bg-white/50 hover:text-slate-900",
                                            tab.comingSoon && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        <span className="flex-1">{tab.label}</span>
                                        {tab.active && <Check className="w-3 h-3 text-indigo-600" />}
                                        {tab.comingSoon && (
                                            <span className="text-[9px] uppercase tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                                Soon
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Click Away Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
