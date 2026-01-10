"use client";

import { useExchangeRate } from "@/context/ExchangeRateContext";

export function ExchangeRateBadge() {
    const { rate, isLoading } = useExchangeRate();

    // Render nothing during SSR and initial load to prevent hydration mismatch
    if (isLoading) return null;
    if (!rate) return null;

    return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
            <span className="text-xs font-bold text-emerald-400">💱</span>
            <span className="text-xs font-bold text-slate-300">
                $1 USD = <span className="text-emerald-400">${rate.usd_cad.toFixed(2)}</span> CAD
            </span>
        </div>
    );
}

