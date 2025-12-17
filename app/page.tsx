import { Search } from "@/components/Search";
import { StatusCard } from "@/components/StatusCard";
import { BorderQLogo } from "@/components/BorderQLogo";
import { getBorderData } from "@/lib/api";
import { TrendingUp, TrendingDown, Clock, Sun, ArrowRight, Calendar, Star, Car } from "lucide-react";

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

  return (
    <main className="min-h-screen bg-[#F6F8FA] text-slate-900 pb-20 font-sans">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center gap-8 mb-8 md:mb-16">

          <div className="space-y-4 max-w-3xl flex flex-col items-center">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-[800] tracking-tight text-slate-900 leading-[1.05]">
              Beat the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Border Wait</span>
            </h1>
            <p className="text-slate-500 text-sm md:text-xl font-medium leading-relaxed max-w-2xl mx-auto whitespace-nowrap tracking-tight">
              Real-time prediction for international crossings.
            </p>

            {/* Vehicle Type Disclaimer */}
            <div className="flex items-center gap-2 text-slate-400 font-medium text-sm bg-white border border-slate-100 shadow-sm px-4 py-2 rounded-full mt-2">
              <Car className="w-4 h-4" />
              <span>Standard Passenger Vehicles</span>
            </div>
          </div>

          {/* Search Removed (Feature Disabled) */}
          <div className="w-full max-w-2xl h-8" />

        </section>

        {/* Region / Division Navigation */}
        <div className="mb-10 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-[800] text-slate-900 tracking-tight">Select Region</h2>
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
              Auto-detected: Seattle
            </span>
          </div>

          <div className="flex flex-col md:flex-row w-full max-w-lg md:max-w-none items-center justify-center gap-3 pb-4">
            {regionTabs.map((tab) => (
              <button
                key={tab.id}
                disabled={tab.comingSoon}
                suppressHydrationWarning
                className={`
                  relative px-6 py-3 rounded-full text-sm font-bold transition-all w-full md:w-auto
                  ${tab.active
                    ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-100'
                    : 'bg-white/50 text-slate-400 hover:bg-white hover:text-slate-600'
                  }
                  ${tab.comingSoon ? 'opacity-60 cursor-not-allowed' : ''}
                `}
              >
                {tab.comingSoon && (
                  <span className="w-2 h-2 rounded-full bg-slate-300/50" />
                )}
                {tab.label}
                {tab.comingSoon && (
                  <span className="ml-1 px-1.5 py-0.5 bg-slate-200/50 text-slate-500 text-[9px] uppercase tracking-wider rounded">Soon</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory pb-8 -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:pb-0 md:mx-0 md:px-0 gap-4 mb-4 md:mb-12 scrollbar-hide">
          {data.data.map((event) => (
            <div key={event.id} className="min-w-[80vw] sm:min-w-[380px] md:min-w-0 snap-center">
              <StatusCard event={event} />
            </div>
          ))}
        </div>

        {/* Mobile Carousel Dots (Visual Hint) */}
        <div className="flex justify-center gap-2 mb-12 md:hidden">
          {data.data.map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
          ))}
        </div>

        {/* Trending Forecasts (Dynamic) */}
        <div className="border-t border-slate-200 pt-10 pb-20">
          <div className="flex items-center justify-between mb-8 px-2">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sortedInsights.map((item) => (
              <a
                key={item.day}
                href={`/stats/seattle-to-vancouver/${item.slug}`}
                className="group bg-white border border-slate-200 p-5 rounded-2xl hover:shadow-md hover:border-indigo-300 transition-all text-left relative overflow-hidden flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2 rounded-lg transition-colors bg-${item.color}-50 text-${item.color}-600 group-hover:bg-${item.color}-100`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full transition-colors bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600`}>
                    {item.badge}
                  </span>
                </div>

                <h4 className="font-[800] text-slate-900 mb-1 group-hover:text-indigo-700 transition-colors">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-grow">{item.description}</p>

                {/* Click Affordance */}
                <div className="flex items-center text-xs font-bold text-indigo-600 opacity-60 group-hover:opacity-100 transition-opacity mt-auto">
                  View Analysis <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
