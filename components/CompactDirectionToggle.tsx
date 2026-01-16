'use client';

import { clsx } from "clsx";
import { useDirection } from "@/context/DirectionContext";
import { motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function CompactDirectionToggle() {
    const { direction, setDirection } = useDirection();
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    // 1. Regional Page Logic (URL Path Switching)
    const isRegionalPage = pathname.includes("vancouver-to-seattle") || pathname.includes("seattle-to-vancouver");
    const isSouthboundUrl = pathname.includes("vancouver-to-seattle");
    const isNorthboundUrl = pathname.includes("seattle-to-vancouver");

    // 2. Specific Port Page Logic (Query Param Switching)
    // Matches: /stats/[port]/[day] but excludes the regional paths
    const isPortPage = pathname.includes("/stats/") && !isRegionalPage;
    const isNorthboundQuery = searchParams.get("direction") === "north";

    // Sync Context with URL on mount/update
    useEffect(() => {
        if (isRegionalPage) {
            if (isSouthboundUrl && direction !== "SOUTHBOUND") setDirection("SOUTHBOUND");
            else if (isNorthboundUrl && direction !== "NORTHBOUND") setDirection("NORTHBOUND");
        } else if (isPortPage) {
            if (!isNorthboundQuery && direction !== "SOUTHBOUND") setDirection("SOUTHBOUND");
            else if (isNorthboundQuery && direction !== "NORTHBOUND") setDirection("NORTHBOUND");
        }
    }, [pathname, searchParams, direction, setDirection, isRegionalPage, isPortPage, isSouthboundUrl, isNorthboundUrl, isNorthboundQuery]);

    const handleSwitch = (newDirection: "SOUTHBOUND" | "NORTHBOUND") => {
        if (newDirection === direction) return;
        setDirection(newDirection);

        if (isRegionalPage) {
            // Regional: Switch URL Path
            if (newDirection === "NORTHBOUND") {
                router.push(pathname.replace("vancouver-to-seattle", "seattle-to-vancouver"));
            } else {
                router.push(pathname.replace("seattle-to-vancouver", "vancouver-to-seattle"));
            }
        } else if (isPortPage) {
            // Port: Switch Query Param
            const params = new URLSearchParams(searchParams.toString());
            if (newDirection === "NORTHBOUND") {
                params.set("direction", "north");
            } else {
                params.delete("direction");
            }
            router.push(`${pathname}?${params.toString()}`);
        }
    };

    return (
        <div className="relative flex items-center bg-slate-100/80 p-1 rounded-lg border border-slate-200 shadow-inner">
            {/* Active Highlight */}
            <motion.div
                layout
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={clsx(
                    "absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-md shadow-sm border border-slate-200/50 pointer-events-none z-0",
                    direction === "SOUTHBOUND" ? "left-1" : "left-[calc(50%+2px)]"
                )}
            />

            {/* Tab: Canada -> USA */}
            <button
                onClick={() => handleSwitch("SOUTHBOUND")}
                className={clsx(
                    "relative z-10 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-colors duration-200 select-none min-w-[100px]",
                    direction === "SOUTHBOUND" ? "text-indigo-900" : "text-slate-500 hover:text-slate-700"
                )}
            >
                <span className="text-sm">🇨🇦</span>
                <span className="whitespace-nowrap">To USA</span>
            </button>

            {/* Tab: USA -> Canada */}
            <button
                onClick={() => handleSwitch("NORTHBOUND")}
                className={clsx(
                    "relative z-10 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-colors duration-200 select-none min-w-[100px]",
                    direction === "NORTHBOUND" ? "text-indigo-900" : "text-slate-500 hover:text-slate-700"
                )}
            >
                <span className="text-sm">🇺🇸</span>
                <span className="whitespace-nowrap">To Canada</span>
            </button>
        </div>
    );
}
