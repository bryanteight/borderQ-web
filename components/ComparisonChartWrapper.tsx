"use client";

import { useEffect, useState } from "react";
import { ComparisonChart } from "./ComparisonChart";

interface ComparisonData {
    day: string;
    direction: string;
    ports: any[];
    best_overall: { port: string; hour: number; wait: number };
    ai_insight: string | null;
    methodology: string;
}

export function ComparisonChartWrapper({ day }: { day: string }) {
    const [data, setData] = useState<ComparisonData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
                const cleanUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
                const res = await fetch(`${cleanUrl}/api/v1/comparison/${day}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                setData(json);
            } catch (e: any) {
                setError(e.message || "Failed to load chart data");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [day]);

    if (loading) {
        return (
            <div className="bg-slate-900 rounded-2xl p-6 animate-pulse">
                <div className="h-6 w-40 bg-slate-800 rounded mb-4"></div>
                <div className="h-64 bg-slate-800 rounded"></div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="bg-slate-900 rounded-2xl p-6 text-center text-slate-500">
                <p>Chart data unavailable</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <ComparisonChart data={data} />

            {data.ai_insight && (
                <section className="space-y-4">
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
                        Detailed Traffic Analysis
                    </h2>
                    <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {data.ai_insight}
                    </div>
                </section>
            )}
        </div>
    );
}
