import { Search } from "@/components/Search";
import { StatusCard } from "@/components/StatusCard";
import { BorderQLogo } from "@/components/BorderQLogo";
import { EventBanner } from "@/components/EventBanner";
import { ExchangeRateBadge } from "@/components/ExchangeRateBadge";
import { getBorderData } from "@/lib/api";
import { TrendingUp, TrendingDown, Clock, Sun, ArrowRight, Calendar, Star, Car } from "lucide-react";
import { PlanAheadWidget } from "@/components/PlanAheadWidget"; // [NEW]
import { StatusCardCarousel } from "@/components/StatusCardCarousel";
import { DirectionTabs } from "@/components/DirectionTabs";
import { EventAlert } from "@/lib/types";

export default async function Home() {
  const data = await getBorderData();
  const hints = [
    "Best time to cross tomorrow?",
    "Peace Arch vs Pacific Highway right now",
    "How was traffic last Christmas?",
    "Forecast for New Year's Day",
    "Is Lynden faster than Peace Arch?",
    "Traffic prediction for Friday afternoon",
    "Was it busy last weekend?",
    "Best time to leave for Vancouver",
    "Compare Saturday vs Sunday traffic"
  ];

  // If data is null or has error
  if (!data || (data.type === 'error' && (!data.data || data.data.length === 0))) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F6F8FA] text-slate-500 gap-4 font-sans">
        <BorderQLogo className="w-16 h-16 opacity-50 mb-2 grayscale" />
        <h2 className="text-xl font-[800] text-slate-700">Connecting to AI Brain...</h2>
        <p className="max-w-md text-center text-sm px-6 leading-relaxed bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          {data?.message || "Initializing connection to traffic prediction engine."}
        </p>
        <div className="text-xs text-slate-400 font-mono mt-4">
          CHECKING: {process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}
        </div>
      </div>
    );
  }

  // Use planning data from backend, or default empty structure
  const planningData = data.planning || { SOUTHBOUND: [], NORTHBOUND: [] };

  return (
    <main className="min-h-screen bg-[#F6F8FA] text-slate-900 pb-20 font-sans">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-10">
        {/* Event Alert Banner - extracted from API data */}
        {(() => {
          // Find first event with an event_alert
          const eventAlert = data.data?.find((e: any) => e.event_alert)?.event_alert as EventAlert | undefined;
          return eventAlert && (
            <div className="mb-4 md:mb-6">
              <EventBanner event={eventAlert} />
            </div>
          );
        })()}

        {/* Hero Section - Slogan visible on Mobile, Title hidden */}
        <section className="flex flex-col items-center text-center gap-1 md:gap-4 mb-2 md:mb-10">

          <div className="space-y-4 max-w-3xl flex flex-col items-center">
            <h1 className="hidden md:block text-4xl sm:text-6xl md:text-7xl font-[800] tracking-tight text-slate-900 leading-[1.05]">
              Plan Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Crossing</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm md:text-xl font-medium leading-relaxed max-w-2xl mx-auto whitespace-nowrap tracking-tight">
              Real-time prediction for international crossings.
            </p>
          </div>
        </section>   {/* Search Removed (Feature Disabled) */}

        {/* Region / Division Navigation */}

        {/* Direction Switcher (Global Context) */}
        <DirectionTabs />

        {/* [NEW] Plan Ahead Widget (Moved to TOP) */}
        <div className="mb-0">
          <PlanAheadWidget planning={planningData} />
        </div>


        <StatusCardCarousel events={data.data} updatedAt={data.timestamp} />

        {/* Legacy "Weekly Patterns" Removed - replaced by PlanAheadWidget */}
      </div>
    </main >
  );
}
