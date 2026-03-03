"use client";

import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Cloud, MapPin, Zap, Info, ShieldAlert, Thermometer, Sparkles, Bot, Check } from "lucide-react";
import { clsx } from "clsx";

export default function VectorsPage() {
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
                            The Science of Prediction
                        </h1>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">

                {/* Intro Section */}
                <section className="text-center max-w-3xl mx-auto space-y-6">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Traffic Prediction with <span className="text-blue-600">Contextual Intelligence</span>
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Standard GPS apps just look at "current speed". We look deeper.
                        Our system analyzes <strong>dozens of variables</strong> to find historical patterns
                        that match the <em>exact DNA</em> of the current moment.
                    </p>
                </section>

                {/* The "Secret Sauce" Grid */}
                <section>
                    <div className="flex items-center gap-3 mb-8 justify-center md:justify-start">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">The Context Engine</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Time of Day */}
                        <DimensionCard
                            icon={<Clock className="w-5 h-5 text-indigo-500" />}
                            title="Cyclical Time"
                            desc="We don't just see linear time. Our model understands the cyclical nature of rush hours, knowing that 11 PM flows naturally into Midnight."
                            bg="bg-indigo-50"
                        />

                        {/* Day of Week */}
                        <DimensionCard
                            icon={<Calendar className="w-5 h-5 text-violet-500" />}
                            title="Dayflow Analysis"
                            desc="Fridays aren't just 'Weekdays'. Our system distinguishes the unique traffic signature of a Friday afternoon vs. a Monday morning."
                            bg="bg-violet-50"
                        />

                        {/* Seasonality */}
                        <DimensionCard
                            icon={<Cloud className="w-5 h-5 text-sky-500" />}
                            title="Seasonal Trends"
                            desc="Summer tourist traffic behaves differently than winter commuter traffic. We adapt to the month and season automatically."
                            bg="bg-sky-50"
                        />

                        {/* Urgency */}
                        <DimensionCard
                            icon={<Zap className="w-5 h-5 text-amber-500" />}
                            title="Event Urgency"
                            desc="Is the game starting in 30 minutes? Or did it just end? We track the 'Pulse' of the city to predict sudden surges."
                            bg="bg-amber-50"
                        />

                        {/* Event Category */}
                        <DimensionCard
                            icon={<Info className="w-5 h-5 text-rose-500" />}
                            title="Crowd Typing"
                            desc="Not all crowds are the same. We differentiate between the steady flow of a Marathon vs. the sudden burst of a Concert exit."
                            bg="bg-rose-50"
                        />

                        {/* Impact Score */}
                        <DimensionCard
                            icon={<ShieldAlert className="w-5 h-5 text-orange-500" />}
                            title="Impact Magnitude"
                            desc="We assess the size of every event—from local gatherings to massive stadium shows—to weight their influence on the border."
                            bg="bg-orange-50"
                        />

                        {/* Weather Severity */}
                        <DimensionCard
                            icon={<Thermometer className="w-5 h-5 text-teal-500" />}
                            title="Weather Resistance"
                            desc="Rain slows traffic. Snow stops it. Our model finds historical days with similar weather profiles to adjust the forecast."
                            bg="bg-teal-50"
                        />

                        {/* Geo Bias */}
                        <DimensionCard
                            icon={<MapPin className="w-5 h-5 text-emerald-500" />}
                            title="Origin Tracking"
                            desc="Where is the crowd coming from? We analyze if an event pulls traffic North (towards Canada) or South (towards USA)."
                            bg="bg-emerald-50"
                        />

                        {/* Holiday Geo Bias */}
                        <DimensionCard
                            icon={<MapPin className="w-5 h-5 text-cyan-500" />}
                            title="Holiday Flow"
                            desc="Canadian holidays push traffic South. US holidays push it North. We account for these massive directional shifts."
                            bg="bg-cyan-50"
                        />

                    </div>
                </section>

                {/* The Twin-Track Strategy */}
                <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold">The Twin-Track Strategy: Planner vs. Nowcast</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 relative">
                            {/* Vertical line for desktop */}
                            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/20"></div>

                            <div className="space-y-4">
                                <div className="uppercase tracking-wider text-xs font-bold opacity-70">Strategic Layer</div>
                                <h4 className="text-2xl font-bold">Context Vectors (Planning)</h4>
                                <p className="text-blue-100 leading-relaxed">
                                    Used for the <strong>7-Day Forecast</strong>. This track searches for historical matches based on "Static Context"—long-range factors like holidays, stadium event schedules, and seasonal weather patterns.
                                </p>
                                <div className="bg-white/10 p-4 rounded-xl text-sm border border-white/10">
                                    <div className="font-bold mb-1">Goal: Accuracy at Distance</div>
                                    <p className="opacity-80 italic">"What is the most likely shape of traffic next Tuesday?"</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="uppercase tracking-wider text-xs font-bold opacity-70">Tactical Layer</div>
                                <h4 className="text-2xl font-bold">Dynamics Vectors (Nowcasting)</h4>
                                <p className="text-blue-100 leading-relaxed">
                                    Powering <strong>Live Updates</strong>. This track ignores the calendar and matches current "Traffic Physics"—momentum, acceleration (rate of change), and spatial variations between neighboring ports.
                                </p>
                                <div className="bg-white/10 p-4 rounded-xl text-sm border border-white/10">
                                    <div className="font-bold mb-1">Goal: Real-time Resilience</div>
                                    <p className="opacity-80 italic">"Something is happening right now. Where have we seen this physics before?"</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Applied AI Section */}
                <section className="space-y-8">
                    <div className="flex items-center gap-3 mb-8 justify-center md:justify-start">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <Bot className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">From Data to Action: Applied Generative AI</h3>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
                        {/* Background decorative elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

                        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <h4 className="text-2xl md:text-3xl font-bold">
                                    Beyond Numbers: <br />
                                    <span className="text-blue-400">An AI That Thinks Like a Local</span>
                                </h4>
                                <p className="text-slate-300 leading-relaxed text-lg">
                                    Raw data charts are hard to read. We use <strong>DSPy (Declarative Self-Improving Python)</strong> to transform complex vector statistics into clear, actionable advice.
                                </p>

                                <ul className="space-y-4">
                                    <li className="flex gap-3">
                                        <div className="bg-blue-500/20 p-1 rounded text-blue-400 h-fit"><Check className="w-4 h-4" /></div>
                                        <div>
                                            <strong className="block text-white">Self-Correcting Logic</strong>
                                            <span className="text-slate-400 text-sm">
                                                Uses a <strong>"Generate & Filter"</strong> architecture. If the AI drafts a report that contradicts the data (e.g., calling a 90-minute wait "smooth"), it catches its own mistake and rewrites it automatically.
                                            </span>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="bg-purple-500/20 p-1 rounded text-purple-400 h-fit"><Check className="w-4 h-4" /></div>
                                        <div>
                                            <strong className="block text-white">Smart Timing Recommendations</strong>
                                            <span className="text-slate-400 text-sm">
                                                Instead of static graphs, it finds specific <strong>"Green Windows"</strong>—identifying exactly when you should leave to shave 30+ minutes off your trip.
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {/* Visual Representation of the "Loop" */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 font-mono text-xs md:text-sm text-slate-300 space-y-4">
                                <div className="flex items-center gap-2 text-blue-400">
                                    <span className="animate-pulse">●</span> INPUT: Context JSON
                                </div>
                                <div className="pl-4 border-l border-white/10 space-y-2">
                                    <div className="opacity-50">data: &#123; peak_wait: 90, event: "Concert" &#125;</div>
                                </div>

                                <div className="flex items-center gap-2 text-yellow-400 mt-4">
                                    <span>⚡</span> GENERATION 1 (Rejected)
                                </div>
                                <div className="pl-4 border-l border-white/10 space-y-2 text-red-300/70 line-through decoration-red-400/50">
                                    "Traffic looks good! Head out now."
                                </div>

                                <div className="flex items-center gap-2 text-emerald-400 mt-4">
                                    <span>✓</span> GENERATION 2 (Approved)
                                </div>
                                <div className="pl-4 border-l border-white/10 space-y-2 text-emerald-100 bg-emerald-500/10 p-2 rounded">
                                    "High traffic alert! Wait until 8 PM to avoid post-concert gridlock."
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Simplified Examples */}
                <section className="bg-white rounded-3xl p-8 md:p-12 shadow-soft-xl border border-slate-100">
                    <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">Ex</div>
                        Real-World Scenarios
                    </h3>

                    <div className="space-y-12">

                        {/* Example 1 */}
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="order-2 md:order-1 bg-slate-50 p-8 rounded-2xl border border-slate-200">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-slate-700">Time Match</span>
                                        <div className="h-2 w-32 bg-slate-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 w-[95%]"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-slate-700">Weather Match</span>
                                        <div className="h-2 w-32 bg-slate-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-teal-500 w-[90%]"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-slate-700">Event Match</span>
                                        <div className="h-2 w-32 bg-slate-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-rose-500 w-[100%]"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                                    <span className="text-sm text-slate-500 uppercase tracking-widest font-semibold">Prediction Confidence</span>
                                    <div className="text-3xl font-black text-slate-900 mt-1">High</div>
                                </div>
                            </div>
                            <div className="order-1 md:order-2 space-y-4">
                                <h4 className="text-xl font-bold text-slate-900">Scenario: "The Rainy Friday Concert"</h4>
                                <p className="text-slate-600 leading-relaxed">
                                    Imagine a major concert ending on a rainy Friday night. Simple averages would just look at "Friday Night Traffic".
                                </p>
                                <p className="text-slate-600 leading-relaxed">
                                    Our system searches specifically for <strong>past rainy Fridays with major events</strong>. It knows that rain + exiting crowds creates a unique congestion pattern that normal Fridays don't have.
                                </p>
                            </div>
                        </div>

                        <div className="w-full h-px bg-slate-100"></div>

                        {/* Example 2 */}
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div className="space-y-4">
                                <h4 className="text-xl font-bold text-slate-900">Scenario: "Holiday Directionality"</h4>
                                <p className="text-slate-600 leading-relaxed">
                                    Not all holidays are the same. US Thanksgiving creates a massive surge Southbound, but Canada Day surges Northbound.
                                </p>
                                <p className="text-slate-600 leading-relaxed">
                                    Our engine applies a <strong>Directional Bias</strong> to every holiday, ensuring we compare apples to apples. If it's Canada Day, we ignore regular Monday traffic and look for similar Northbound-heavy historical days.
                                </p>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 flex flex-col justify-center items-center text-center space-y-4">
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 w-full max-w-xs">
                                    <div className="text-xs text-slate-400 uppercase font-bold mb-1">Upcoming Day</div>
                                    <div className="font-bold text-indigo-600 text-lg">Canada Day 🇨🇦</div>
                                </div>
                                <div className="text-slate-300 transform rotate-90 md:rotate-0">
                                    <ArrowLeft className="w-6 h-6 rotate-[-90deg] md:rotate-0 inline-block" /> MATCHES <ArrowLeft className="w-6 h-6 rotate-[-90deg] md:rotate-0 inline-block" />
                                </div>
                                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 w-full max-w-xs">
                                    <div className="text-xs text-emerald-600 uppercase font-bold mb-1">Historical Match</div>
                                    <div className="font-bold text-slate-800 text-lg">Past Canada Day 2024</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

            </main>
        </div>
    );
}

function DimensionCard({ icon, title, desc, bg }: { icon: React.ReactNode, title: string, desc: string, bg: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center mb-4", bg)}>
                {icon}
            </div>
            <div className="flex justify-between items-baseline mb-2">
                <h4 className="font-bold text-slate-900">{title}</h4>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
                {desc}
            </p>
        </div>
    )
}
