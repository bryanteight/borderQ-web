import { SummaryResponse } from "@/lib/types";

// Force dynamic rendering so we always get fresh data
export const dynamic = 'force-dynamic';

export async function getBorderData(): Promise<SummaryResponse | null> {
    try {
        // In production, use your Railway URL. Locally use 127.0.0.1 to avoid localhost IPv6 issues.
        let baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

        // Sanitize URL (remove trailing slash)
        if (baseUrl.endsWith('/')) {
            baseUrl = baseUrl.slice(0, -1);
        }

        const res = await fetch(`${baseUrl}/api/v1/summary`, { cache: 'no-store' });

        if (!res.ok) {
            return { type: "error", data: [], message: `API Error: ${res.status} ${res.statusText}` };
        }

        return res.json();
    } catch (e: any) {
        // Return a structured error that the UI can display
        return {
            type: "error",
            data: [],
            message: e?.message || "Connection refused. Is backend running?"
        };
    }
}
