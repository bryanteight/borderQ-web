'use client';

import { useDirection } from "@/context/DirectionContext";

export function PlanAheadHeader() {
    const { direction } = useDirection();

    // Hide for Northbound until data collection is complete
    if (direction === 'NORTHBOUND') return null;

    return (
        <section className="flex flex-col items-center text-center gap-1 md:gap-4 mb-2 md:mb-10 opacity-80 scale-90 origin-top">
            <div className="space-y-2 max-w-3xl flex flex-col items-center">
                <h2 className="hidden md:block text-4xl font-[800] tracking-tight text-slate-900 leading-tight">
                    Plan Your <span className="text-indigo-600">Crossing</span>
                </h2>
                <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                    Forecast & Strategy
                </p>
            </div>
        </section>
    );
}

