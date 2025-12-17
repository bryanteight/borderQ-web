import { Search } from "@/components/Search";
import { StatusCard } from "@/components/StatusCard";
import { BorderQLogo } from "@/components/BorderQLogo";
import { getBorderData } from "@/lib/api";
import { TrendingUp, TrendingDown, Clock, Sun, ArrowRight, Calendar, Star, Car } from "lucide-react";
import { WeeklyPatternsCarousel } from "@/components/WeeklyPatternsCarousel";
import { StatusCardCarousel } from "@/components/StatusCardCarousel";
import { RegionSelector } from "@/components/RegionSelector";

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

  const regionTabs = [
    { id: 'seattle', label: 'Seattle / BC', active: true, comingSoon: false },
    { id: 'niagara', label: 'Niagara / NY', active: false, comingSoon: true },
    { id: 'detroit', label: 'Detroit / Windsor', active: false, comingSoon: true },
  ];

  // Dynamic Trending Logic
  const todayDate = new Date();
  const today = todayDate.toLocaleDateString('en-US', { weekday: 'long' });
  const dayIndex = todayDate.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

  // Simple Holiday Check (Next 30 Days)
  const getUpcomingHoliday = () => {
    const year = todayDate.getFullYear();
    const holidays = [
      { name: 'Christmas', date: new Date(year, 11, 25), icon: Star },       // Dec 25
      { name: 'New Year\'s Eve', date: new Date(year, 11, 31), icon: Calendar }, // Dec 31
      { name: 'New Year\'s Day', date: new Date(year, 0, 1), icon: Calendar },   // Jan 1 (check year+1 logic below if needed, simplified here)
      { name: 'Victoria Day', date: new Date(year, 4, 20), icon: Star },     // ~May 24 (Fixed for simplicty)
      { name: 'Canada Day', date: new Date(year, 6, 1), icon: Star },        // July 1
      { name: 'Independence Day', date: new Date(year, 6, 4), icon: Star },  // July 4
      { name: 'Labor Day', date: new Date(year, 8, 2), icon: Star },         // ~Sept
      { name: 'Thanksgiving', date: new Date(year, 10, 28), icon: Star },    // ~Nov (US)
    ];

    // Handle year wrap for early Jan holidays if currently Dec
    if (todayDate.getMonth() === 11) {
      holidays.push({ name: 'New Year\'s Day', date: new Date(year + 1, 0, 1), icon: Calendar });
    }

    for (const h of holidays) {
      const diffTime = h.date.getTime() - todayDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays <= 30) {
        return {
          day: 'Holiday',
          slug: h.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), // url-friendly slug
          title: `${h.name} Forecast`,
          description: `Historical trends for ${h.name}. Expect delays.`,
          icon: h.icon,
          color: 'violet',
          badge: 'Special Event',
          priority: true // Always top priority
        };
      }
    }
    return null;
  };

  const holidayInsight = getUpcomingHoliday();

  // Define curated insights
  const insights = [
    {
      day: 'Friday',
      slug: 'friday',
      title: 'Friday Getaway',
      description: 'Heavy outbound traffic. Plan ahead.',
      icon: TrendingUp,
      color: 'rose',
      badge: 'Busiest',
      priority: dayIndex === 5 || dayIndex === 4
    },
    {
      day: 'Sunday',
      slug: 'sunday',
      title: 'Sunday Traffic',
      description: 'Expect heavier volumes in afternoon.',
      icon: Clock,
      color: 'amber',
      badge: 'Delays',
      priority: dayIndex === 0
    },
    {
      day: 'Saturday',
      slug: 'saturday',
      title: 'Saturday Trip',
      description: 'Best for day trips before 8 AM.',
      icon: Sun,
      color: 'emerald',
      badge: 'Moderate',
      priority: dayIndex === 6
    },
    {
      day: 'Tuesday',
      slug: 'tuesday',
      title: 'Mid-Week Value',
      description: 'Historical data shows shortest waits.',
      icon: TrendingDown,
      color: 'sky',
      badge: 'Best Value',
      priority: dayIndex >= 1 && dayIndex <= 3
    }
  ];

  // Merge Holiday if exists
  if (holidayInsight) {
    insights.push(holidayInsight);
  }

  // Sort insights: Priority first
  const sortedInsights = [...insights].sort((a, b) => (b.priority ? 1 : 0) - (a.priority ? 1 : 0));
  // If we have a holiday (5 items), slice to top 4 to keep grid clean, or allow 5? 
  // Grid handles it, but let's stick to 4 primarily unless holiday pushes one out.
  // Actually, keeping all is fine, grid will wrap. Let's just sort.

  // Prepare items for Client Component (Pass rendered icon nodes to avoid serialization issues)
  const carouselItems = sortedInsights.map(item => ({
    ...item,
    icon: <item.icon className="w-5 h-5" />
  }));

  return (
    <main className="min-h-screen bg-[#F6F8FA] text-slate-900 pb-20 font-sans">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center gap-4 mb-8 md:mb-10">

          <div className="space-y-4 max-w-3xl flex flex-col items-center">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-[800] tracking-tight text-slate-900 leading-[1.05]">
              Beat the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Border Wait</span>
            </h1>
            <p className="text-slate-500 text-sm md:text-xl font-medium leading-relaxed max-w-2xl mx-auto whitespace-nowrap tracking-tight">
              Real-time prediction for international crossings.
            </p>


          </div>

          {/* Search Removed (Feature Disabled) */}
          {/* Region / Division Navigation */}
        </section>

        {/* Region Selection: Responsive Split */}
        <div className="mb-6 w-full flex flex-col items-center">

          {/* Mobile: Fancy Dropdown */}
          <div className="md:hidden w-full">
            <RegionSelector tabs={regionTabs} />
          </div>

          {/* Desktop: Original List (Restored) */}
          <div className="hidden md:flex flex-col items-center">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-[800] text-slate-900 tracking-tight">Select Region</h2>
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
                Auto-detected: Seattle
              </span>
            </div>

            <div className="flex flex-row items-center justify-center gap-3">
              {regionTabs.map((tab) => (
                <button
                  key={tab.id}
                  disabled={tab.comingSoon}
                  suppressHydrationWarning
                  className={`
                              relative px-6 py-3 rounded-full text-sm font-bold transition-all
                              ${tab.active
                      ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-100'
                      : 'bg-white/50 text-slate-400 hover:bg-white hover:text-slate-600'
                    }
                              ${tab.comingSoon ? 'opacity-60 cursor-not-allowed' : ''}
                            `}
                >
                  {tab.comingSoon && (
                    <span className="w-2 h-2 rounded-full bg-slate-300/50 inline-block mr-2" />
                  )}
                  {tab.label}
                  {tab.comingSoon && (
                    <span className="ml-1.5 px-1.5 py-0.5 bg-slate-200/50 text-slate-500 text-[9px] uppercase tracking-wider rounded">Soon</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <StatusCardCarousel events={data.data} />

        {/* Trending Forecasts (Dynamic) */}
        <div className="border-t border-slate-200 pt-6 md:pt-10 pb-20">
          <div className="flex items-center justify-between mb-6 md:mb-8 px-2">
            <div>
              <h3 className="text-lg font-[800] text-slate-900 tracking-tight">Weekly Traffic Patterns</h3>
              <p className="text-slate-500 text-sm">
                Typical wait time trends
              </p>
            </div>
            {/* Visual Flair: "Live" dot */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Live Insights</span>
            </div>
          </div>

          <WeeklyPatternsCarousel items={carouselItems} />
        </div>

      </div>
    </main>
  );
}
