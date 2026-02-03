import { getComparisonForecast } from "@/lib/api";
import { ForecastDetailView } from "@/components/ForecastDetailView";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type Props = {
    params: Promise<{
        direction: string;
        date: string;
    }>;
};

// Metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { direction, date } = await params;

    // Format date for title
    const dateObj = new Date(date + 'T12:00:00');
    const displayDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    return {
        title: `Border Wait Forecast for ${displayDate} | BorderQ`,
        description: `AI-powered border wait time prediction for ${date}. Specific forecast for ${direction.replace(/-/g, ' ')}.`
    };
}

export default async function ForecastPage({ params }: Props) {
    const { direction, date } = await params;

    // Map URL slug to backend enums
    let dirEnum = "";

    if (direction === "vancouver-to-seattle") {
        dirEnum = "SOUTHBOUND";
    } else if (direction === "seattle-to-vancouver") {
        dirEnum = "NORTHBOUND";
    } else {
        notFound();
    }

    const forecast = await getComparisonForecast(date, dirEnum);

    if (!forecast) {
        return (
            <div className="min-h-screen bg-[#F6F8FA] flex flex-col items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                        <h1 className="text-2xl font-[900] text-slate-900 mb-2">Forecast Unavailable</h1>
                        <p className="text-slate-500 mb-6">
                            We couldn't generate a specific prediction for <span className="font-bold text-slate-700">{date}</span>.
                            This might be due to a connection issue or the date being too far in the past/future.
                        </p>
                        <a href="/" className="inline-block bg-slate-900 text-white font-bold py-3 px-6 rounded-xl hover:bg-slate-800 transition-colors">
                            Return Home
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return <ForecastDetailView forecast={forecast} />;
}
