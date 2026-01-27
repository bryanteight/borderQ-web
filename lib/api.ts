import { SummaryResponse } from "@/lib/types";

// Force dynamic rendering so we always get fresh data
export const dynamic = 'force-dynamic';

export function getBaseUrl(): string {
    let baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    if (baseUrl.endsWith('/')) {
        baseUrl = baseUrl.slice(0, -1);
    }
    return baseUrl;
}

export async function getBorderData(): Promise<SummaryResponse | null> {
    try {
        const baseUrl = getBaseUrl();
        const res = await fetch(`${baseUrl}/api/v1/summary`, { cache: 'no-store' });

        if (!res.ok) {
            return { type: "error", data: [], message: `API Error: ${res.status} ${res.statusText}` };
        }

        return res.json();
    } catch (e: any) {
        return {
            type: "error",
            data: [],
            message: e?.message || "Connection refused. Is backend running?"
        };
    }
}

export interface ExchangeRate {
    usd_cad: number;
    cad_usd: number;
    formatted: string;
    last_updated: string;
}

export async function getExchangeRate(): Promise<ExchangeRate | null> {
    try {
        const baseUrl = getBaseUrl();
        const res = await fetch(`${baseUrl}/api/v1/exchange-rate`, {
            cache: 'no-store',
            next: { revalidate: 3600 } // Revalidate every hour
        });

        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}
