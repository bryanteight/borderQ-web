"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { ExchangeRate } from "@/lib/api";

interface ExchangeRateContextValue {
    rate: ExchangeRate | null;
    isLoading: boolean;
}

const ExchangeRateContext = createContext<ExchangeRateContextValue>({
    rate: null,
    isLoading: true,
});

export function ExchangeRateProvider({ children }: { children: ReactNode }) {
    const [rate, setRate] = useState<ExchangeRate | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchRate() {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
                const res = await fetch(`${baseUrl}/api/v1/exchange-rate`);
                if (res.ok) {
                    setRate(await res.json());
                }
            } catch (error) {
                // Log in dev for debugging, but don't break UX - rate is optional
                if (process.env.NODE_ENV === 'development') {
                    console.warn('[ExchangeRate] Failed to fetch:', error);
                }
            } finally {
                setIsLoading(false);
            }
        }
        fetchRate();
    }, []);

    return (
        <ExchangeRateContext.Provider value={{ rate, isLoading }}>
            {children}
        </ExchangeRateContext.Provider>
    );
}

export function useExchangeRate() {
    return useContext(ExchangeRateContext);
}
