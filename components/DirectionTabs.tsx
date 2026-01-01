'use client';

import { clsx } from "clsx";
import { useDirection } from "@/context/DirectionContext";
import { motion } from "framer-motion";

export function DirectionTabs() {
    const { direction, setDirection } = useDirection();

    return (
        <div className="flex justify-center w-full px-4 mb-3 md:mb-6">
            <div className="relative flex w-full max-w-sm bg-slate-100 p-1 rounded-xl shadow-inner border border-slate-200">

                {/* Active Slider Background */}
                <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={clsx(
                        "absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm border border-slate-200/50 pointer-events-none",
                        direction === "SOUTHBOUND" ? "left-1" : "left-[calc(50%+2px)]" // Adjust position based on index
                    )}
                />

                {/* Tab: Canada to USA */}
                <button
                    onClick={() => setDirection("SOUTHBOUND")}
                    className={clsx(
                        "relative z-10 flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold transition-colors duration-300 rounded-lg select-none",
                        direction === "SOUTHBOUND" ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    <span className="text-xl">🇨🇦</span>
                    <span>To USA</span>
                </button>

                {/* Tab: USA to Canada */}
                <button
                    onClick={() => setDirection("NORTHBOUND")}
                    className={clsx(
                        "relative z-10 flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold transition-colors duration-300 rounded-lg select-none",
                        direction === "NORTHBOUND" ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    <span className="text-xl">🇺🇸</span>
                    <span>To Canada</span>
                </button>
            </div>
        </div>
    );
}
