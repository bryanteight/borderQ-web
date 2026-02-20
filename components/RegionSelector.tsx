"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { clsx } from "clsx";

type RegionTab = {
    id: string;
    label: string;
    comingSoon?: boolean;
};

const REGION_TABS: RegionTab[] = [
    { id: "cascadia", label: "BC / WA" },
    { id: "detroit", label: "Detroit / Windsor", comingSoon: false },
    { id: "niagara", label: "Niagara / NY", comingSoon: false },
];

export function RegionSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeRegion = searchParams.get("region") || "cascadia";
    const activeTab = REGION_TABS.find((t) => t.id === activeRegion) || REGION_TABS[0];

    const handleSelect = (tab: RegionTab) => {
        if (tab.comingSoon) return;
        setIsOpen(false);
        const params = new URLSearchParams(searchParams.toString());
        params.set("region", tab.id);
        router.push(`/?${params.toString()}`);
    };

    return (
        <div className="relative z-20">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "relative flex items-center gap-2 rounded-full transition-all duration-300",
                    "px-3 py-1.5 bg-slate-100 border border-slate-200",
                    "sm:px-5 sm:py-2.5 sm:bg-white sm:border-slate-300 sm:shadow-sm sm:hover:shadow-md sm:hover:border-slate-400",
                    "active:scale-95"
                )}
            >
                <span className="hidden sm:inline text-sm font-bold text-slate-500 mr-1.5">
                    Region:
                </span>

                <span className="text-xs sm:text-sm font-[900] text-slate-900 uppercase tracking-wide">
                    {activeTab.label}
                </span>
                <ChevronDown
                    className={clsx(
                        "w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 sm:text-slate-600 transition-transform duration-300",
                        isOpen && "rotate-180"
                    )}
                />
            </button>

            {/* Dropdown Menu */}
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
                                {REGION_TABS.map((tab) => (
                                    <button
                                        key={tab.id}
                                        disabled={tab.comingSoon}
                                        onClick={() => handleSelect(tab)}
                                        className={clsx(
                                            "flex items-center justify-between w-full px-3 py-2 rounded-xl text-left transition-colors text-xs font-bold",
                                            tab.id === activeRegion
                                                ? "bg-indigo-50 text-indigo-700"
                                                : "text-slate-600 hover:bg-white/50 hover:text-slate-900",
                                            tab.comingSoon && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        <span className="flex-1">{tab.label}</span>
                                        {tab.id === activeRegion && <Check className="w-3 h-3 text-indigo-600" />}
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

