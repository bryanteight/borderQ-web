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
import { PlanAheadHeader } from "@/components/PlanAheadHeader";

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



        {/* 2. Live Traffic Status (Compact) */}
        <div className="mb-4 md:mb-12">
          <StatusCardCarousel events={data.data} updatedAt={data.timestamp} />
        </div>

        {/* 3. Hero Section (Slogan) - Optional/Reduced */}
        <PlanAheadHeader />

        {/* 4. Plan Ahead Widget - "Peeking" Up Aggressively */}
        <div className="-mt-12 md:mt-0 relative z-10">
          <PlanAheadWidget planning={planningData} />
        </div>

        {/* Legacy "Weekly Patterns" Removed - replaced by PlanAheadWidget */}
      </div>
    </main >
  );
}
