import Link from "next/link";
import { ArrowLeft, Clock, AlertCircle, Cloud, Calendar, TrendingDown } from "lucide-react";
import { clsx } from "clsx";

// Mock Data for the prototype
// In production, this would come from `getBorderData()` or a specific API
const MOCK_DATA = {
    "peace-arch": {
        name: "Peace Arch",
        avgWait: 35,
        insight: `"Sundays are usually moderate, but avoid crossing between 2 PM - 4 PM."`,
        hourly: [20, 35, 50, 40, 25, 15], // 8am, 12pm, 4pm, 8pm... roughly
        bestTime: "Before 10 AM",
        worstTime: "around 4 PM",
        weatherImpact: "+10m",
        holiday: "Thanksgiving Warning"
    },
    "pacific-highway": {
        name: "Pacific Highway",
        avgWait: 45,
        insight: `"Heavy truck traffic expected. Consider alternate routes if wait exceeds 50min."`,
        hourly: [30, 45, 60, 55, 30, 20],
        bestTime: "Late Night",
        worstTime: "Mid-Afternoon",
        weatherImpact: "+15m",
        holiday: "Long Weekend Alert"
    },
    "lynden": {
        name: "Lynden",
        avgWait: 15,
        insight: `"Great alternative for non-NEXUS travelers. Usually 15m faster today."`,
        hourly: [10, 20, 25, 15, 10, 5],
        bestTime: "Anytime",
        worstTime: "Noon",
        weatherImpact: "None",
        holiday: "Clear"
    }
};

export default function ReportPage({ params }: { params: { slug: string } }) {
    const data = MOCK_DATA[params.slug as keyof typeof MOCK_DATA] || MOCK_DATA["peace-arch"];

    return (
        <main className="min-h-screen bg-[#F6F8FA] text-slate-900 pb-20 font-sans">
            {/* Header / Nav */}
            <header className="sticky top-0 z-10 bg-[#F6F8FA]/90 backdrop-blur-md border-b border-transparent py-4 px-6 mb-6">
                <div className="max-w-md mx-auto flex items-center gap-4">
                    <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-white hover:shadow-sm transition-all text-slate-500 hover:text-slate-900">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <span className="font-[800] text-lg text-slate-900">Back to Dashboard</span>
                </div>
            </header>

            <div className="max-w-md mx-auto px-6 space-y-6">

                {/* Title */}
                <h1 className="text-3xl font-[800] tracking-tight text-slate-900 leading-tight">
                    {data.name}: Sunday Traffic Forecast
                </h1>

                {/* 1. Main Insight Card */}
                <div className="bg-white rounded-[32px] p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
                    <div className="flex gap-8 items-start">
                        {/* Left: Big Number */}
                        <div className="flex flex-col border-r border-slate-100 pr-8">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Average Wait</span>
                            <div className="flex items-baseline">
                                <span className="text-7xl font-[800] tracking-tighter text-slate-900 leading-none">{data.avgWait}</span>
                                <span className="text-xl font-bold text-slate-400 ml-1">min</span>
                            </div>
                        </div>

                        {/* Right: Insight Text */}
                        <div className="flex-1 pt-1">
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingDown className="w-4 h-4 text-violet-600" />
                                <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">AI Insight</span>
                            </div>
                            <p className="text-base font-bold text-slate-600 leading-relaxed italic">
                                {data.insight}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. Chart Card */}
                <div className="bg-white rounded-[32px] p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
                    <h3 className="text-base font-[800] text-slate-900 mb-8">Typical Hourly Trend</h3>

                    <div className="flex items-end justify-between h-40 px-2 gap-4">
                        {data.hourly.map((val, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 flex-1 group cursor-default">
                                <div
                                    className="w-full bg-slate-100 rounded-t-xl group-hover:bg-indigo-100 transition-colors relative"
                                    style={{ height: `${val * 1.5}%` }}
                                >
                                    {/* Tooltip on hover */}
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded transition-opacity whitespace-nowrap">
                                        {val} min
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">{["8 AM", "12 PM", "4 PM", "8 PM", "10 PM", "12 AM"][i] || ""}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Grid Widgets */}
                <div className="grid grid-cols-2 gap-4">

                    {/* Best Time */}
                    <div className="bg-white rounded-[32px] p-6 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
                        <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center mb-3 text-violet-600">
                            <Clock className="w-4 h-4" />
                        </div>
                        <div className="text-xs font-semibold text-slate-500 mb-1">Best Time to Go</div>
                        <div className="text-lg font-[800] text-slate-900 leading-tight">{data.bestTime}</div>
                    </div>

                    {/* Worst Time */}
                    <div className="bg-white rounded-[32px] p-6 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mb-3 text-blue-600">
                            <AlertCircle className="w-4 h-4" />
                        </div>
                        <div className="text-xs font-semibold text-slate-500 mb-1">Worst Time</div>
                        <div className="text-lg font-[800] text-slate-900 leading-tight">{data.worstTime}</div>
                    </div>

                    {/* Weather */}
                    <div className="bg-white rounded-[32px] p-6 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center mb-3 text-indigo-600">
                            <Cloud className="w-4 h-4" />
                        </div>
                        <div className="text-xs font-semibold text-slate-500 mb-1">Weather Impact</div>
                        <div className="text-base font-[800] text-slate-900 leading-tight">Rain adds <span className="text-indigo-600">{data.weatherImpact}</span></div>
                    </div>

                    {/* Holiday */}
                    <div className="bg-white rounded-[32px] p-6 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
                        <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center mb-3 text-sky-600">
                            <Calendar className="w-4 h-4" />
                        </div>
                        <div className="text-xs font-semibold text-slate-500 mb-1">Next Holiday</div>
                        <div className="text-base font-[800] text-slate-900 leading-tight">{data.holiday}</div>
                    </div>

                </div>

            </div>
        </main>
    );
}
