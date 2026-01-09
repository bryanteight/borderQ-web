"use client";

import { useEffect, useState } from "react";
import { ExchangeRate } from "@/lib/api";

export function ExchangeRateBadge() {
    const [rate, setRate] = useState<ExchangeRate | null>(null);

    useEffect(() => {
        async function fetchRate() {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
                const res = await fetch(`${baseUrl}/api/v1/exchange-rate`);
                if (res.ok) {
                    setRate(await res.json());
                }
            } catch {
                // Silent fail - rate is optional
            }
        }
        fetchRate();
    }, []);

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
