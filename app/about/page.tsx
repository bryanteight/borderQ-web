"use client";

import Link from "next/link";
import { ArrowLeft, Users, MapPin, Sparkles, MessageSquare } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors bg-slate-100/50 hover:bg-blue-50 px-3 py-2 rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium text-sm">Back to Dashboard</span>
                        </Link>
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 hidden sm:block">
                            About BorderQ
                        </h1>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-12">

                {/* Hero Section */}
                <section className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold">
                        <Sparkles className="w-4 h-4" />
                        Beta Version
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Smarter Border Crossings
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        BorderQ is built by independent developers in <strong>Seattle</strong> who cross the US-Canada border regularly.
                    </p>
                </section>

                {/* Why We Built This */}
                <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 space-y-6">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                            <Users className="w-4 h-4" />
                        </div>
                        Why We Built This
                    </h3>

                    <div className="space-y-4 text-slate-600 leading-relaxed">
                        <p>
                            We got tired of navigating <strong>unfriendly official sites</strong> and hunting for camera snapshots across multiple sources.
                        </p>
                        <p>
                            So we combined everything into <strong>one place</strong> for easy access to live wait times, camera feeds, and historical patterns.
                        </p>
                        <p>
                            We're also tired of <strong>guessing</strong> wait times. That's why we built smarter predictions using similarity matching and historical data analysis.
                        </p>
                    </div>
                </section>

                {/* Data Sources */}
                <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 space-y-6">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <MapPin className="w-4 h-4" />
                        </div>
                        Our Data Sources
                    </h3>

                    <ul className="space-y-3 text-slate-600">
                        <li className="flex items-start gap-3">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span><strong>CBSA</strong> — Canada Border Services Agency</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span><strong>US CBP</strong> — U.S. Customs and Border Protection</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span><strong>DriveBC</strong> — Live camera snapshots</span>
                        </li>
                    </ul>

                    <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl">
                        We display the <strong>maximum</strong> wait time across all sources to give you the most conservative estimate.
                    </p>
                </section>

                {/* Beta Notice */}
                <section className="bg-indigo-50 rounded-3xl p-8 md:p-12 border border-indigo-100 space-y-4 text-center">
                    <h3 className="text-xl font-bold text-indigo-900">We're Still Learning</h3>
                    <p className="text-indigo-700 leading-relaxed">
                        BorderQ is in active development. The more data we collect, the smarter our predictions become.
                    </p>
                    <p className="text-indigo-700 leading-relaxed">
                        Have feedback? We'd love to hear from you.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition-colors"
                    >
                        <MessageSquare className="w-4 h-4" />
                        Send Feedback
                    </Link>
                </section>

            </main>
        </div>
    );
}
