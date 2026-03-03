import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, TrendingUp, Navigation, Clock, Car, Activity, Zap, Minus, ChevronRight, HelpCircle } from "lucide-react";
import { clsx } from "clsx";
import { PORT_METADATA } from "@/lib/port-metadata";
import { Metadata } from "next";

// Reuse the getStats logic but note we need it for the current day
async function getStats(portId: string, day: string) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const cleanUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const res = await fetch(`${cleanUrl}/api/v1/stats/${portId}/${day}`, { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch (e) {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ port: string }> }): Promise<Metadata> {
    const { port } = await params;
    const metadata = PORT_METADATA[port];
    if (!metadata) return { title: "Port Not Found" };

    return {
        title: `${metadata.name} Border: Live Wait Time | BorderQ`,
        description: metadata.summary,
        openGraph: {
            title: `${metadata.name} Border: Live Wait Time`,
            description: metadata.summary,
            type: 'article',
        }
    };
}

export default async function CrossingHubPage({ params }: { params: Promise<{ port: string }> }) {
    const { port } = await params;
    const metadata = PORT_METADATA[port];

    if (!metadata) {
        notFound();
    }

    // Get current day of week (e.g., "Saturday")
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = days[now.getDay()];
    const currentDayKey = currentDay.toLowerCase();

    // Fetch stats for today to show the trend chart
    const data = await getStats(port, currentDayKey);

    // JSON-LD for FAQ
    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": metadata.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    const stats = data?.stats;
    const realtime = data?.realtime;
    const keyHours = [6, 9, 12, 15, 18, 21];
    const hourlyData = stats?.hourly || [];
    const chartData = keyHours.map(h => {
        const found = hourlyData.find((x: any) => x.hour === h);
        return found || { hour: h, wait: 0 };
    });

    const getLabel = (h: number) => {
        if (h === 6) return '6am';
        if (h === 9) return '9am';
        if (h === 12) return '12pm';
        if (h === 15) return '3pm';
        if (h === 18) return '6pm';
        if (h === 21) return '9pm';
        return '';
    };

    return (
        <main className="min-h-screen bg-[#F6F8FA] text-slate-900 pb-20 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />

            {/* Hub Header */}
            <header className="relative bg-white border-b border-slate-100 py-6 px-6">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="p-2 rounded-full bg-slate-50 border border-slate-100 group-hover:bg-indigo-50 transition-colors">
                            <ArrowLeft className="w-4 h-4 text-slate-600 group-hover:text-indigo-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">Dashboard</span>
                    </Link>
                    <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        Live Hub
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 mt-8 space-y-8">
                {/* Hero Section */}
                <section className="space-y-4">
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
                            Border Crossing Guide
                        </span>
                        <h1 className="text-4xl md:text-5xl font-[900] tracking-tight text-slate-900 leading-tight">
                            {metadata.name} Border: Live Wait Time
                        </h1>
                    </div>
                    <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl font-medium">
                        {metadata.summary}
                    </p>
                </section>

                {/* Primary Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Live Snapshot */}
                    <div className="md:col-span-2 bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden group shadow-2xl shadow-indigo-200/50">
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Current Status</span>
                                <div className="flex items-baseline mt-2">
                                    <span className="text-7xl font-[900] tracking-tighter leading-none text-white">
                                        {realtime?.wait_time ?? "--"}
                                    </span>
                                    <span className="text-2xl font-black text-slate-500 ml-2">min</span>
                                </div>
                            </div>
                            <div className="mt-8 flex items-center gap-4">
                                <Link href={`/stats/${port}/${currentDayKey}`} className="flex-1 bg-white text-slate-900 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-center hover:bg-indigo-50 transition-colors">
                                    Full {currentDay} Report
                                </Link>
                            </div>
                        </div>
                        {/* Decor */}
                        <Activity className="absolute -bottom-8 -right-8 w-48 h-48 text-white/5 opacity-10 rotate-12" />
                    </div>

                    {/* Quick Info Cards */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Typical for {currentDay}</span>
                            <div className="text-2xl font-[800] text-slate-900">{stats?.avg_wait ?? "--"}m avg</div>
                            <p className="text-xs text-slate-500 mt-2 font-medium">Based on 12 months of AI data.</p>
                        </div>
                        <div className="bg-indigo-600 rounded-[24px] p-6 text-white flex-1 relative overflow-hidden">
                            <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest block mb-2">Pro Tip</span>
                            <div className="text-sm font-bold leading-snug">
                                Best time today: <span className="underline decoration-indigo-300 underline-offset-4">{stats?.best_time ?? "Early Morning"}</span>
                            </div>
                            <Zap className="absolute -bottom-2 -right-2 w-12 h-12 text-white/10" />
                        </div>
                    </div>
                </div>

                {/* Uniqueness & Details */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-slate-200/60">
                    <div className="space-y-3">
                        <h2 className="text-xl font-[800] text-slate-900 flex items-center gap-2">
                            <Navigation className="w-5 h-5 text-indigo-500" />
                            Port Speciality
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-[15px]">
                            {metadata.uniqueness}
                        </p>
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-xl font-[800] text-slate-900 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-indigo-500" />
                            Typical Waiting Time
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-[15px]">
                            {metadata.typicalWait}
                        </p>
                    </div>
                </section>

                {/* Hourly Trend Chart */}
                <section className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                        <div>
                            <h2 className="text-2xl font-[900] text-slate-900 tracking-tight">Typical {currentDay} Pattern</h2>
                            <p className="text-slate-500 text-sm font-medium mt-1">Average wait times by hour (Passenger Vehicles)</p>
                        </div>
                        <Link href={`/stats/${port}/${currentDayKey}`} className="flex items-center gap-2 text-indigo-600 font-bold text-sm hover:underline">
                            View All {currentDay} Details <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="flex items-end h-48 gap-3 md:gap-4">
                        {chartData.map((h: any) => {
                            const maxVal = Math.max(...chartData.map(d => d.wait), 1);
                            const barHeight = h.wait > 0 ? Math.max(8, (h.wait / maxVal) * 160) : 4;

                            return (
                                <Link
                                    key={h.hour}
                                    href={`/stats/${port}/${currentDayKey}`}
                                    className="flex flex-col flex-1 h-full justify-end group transition-all"
                                >
                                    <div className="mb-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{h.wait}m</span>
                                    </div>
                                    <div
                                        className="w-full bg-slate-100 group-hover:bg-indigo-600 group-hover:shadow-lg group-hover:shadow-indigo-200 transition-all rounded-t-2xl relative"
                                        style={{ height: `${barHeight}px` }}
                                    >
                                        <div className="absolute inset-x-0 top-0 h-2 bg-white/20 rounded-t-2xl" />
                                    </div>
                                    <div className="mt-4 text-center">
                                        <span className="text-[10px] font-black text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-widest">{getLabel(h.hour)}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-6 pt-8">
                    <div className="flex items-center gap-3">
                        <HelpCircle className="w-6 h-6 text-indigo-600" />
                        <h2 className="text-2xl font-[900] text-slate-900 tracking-tight">Common Questions</h2>
                    </div>
                    <div className="grid gap-4">
                        {metadata.faqs.map((faq, i) => (
                            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:border-indigo-100 transition-colors">
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{faq.question}</h3>
                                <p className="text-slate-600 leading-relaxed text-[15px]">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
