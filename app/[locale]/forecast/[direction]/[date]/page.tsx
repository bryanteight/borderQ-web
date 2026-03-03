import { getComparisonForecast } from "@/lib/api";
import { ForecastDetailView } from "@/components/ForecastDetailView";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
    params: Promise<{
        locale: string;
        direction: string;
        date: string;
    }>;
};

// Metadata for SEO (localized)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, direction, date } = await params;
    const t = await getTranslations({ locale, namespace: 'ForecastDetail' });

    // Format date for title using the user's locale
    const dateObj = new Date(date + 'T12:00:00');
    const displayDate = dateObj.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric' });
    const displayDirection = direction.replace(/-/g, ' ');

    return {
        title: t('forecastMetaTitle', { date: displayDate }),
        description: t('forecastMetaDescription', { date: date, direction: displayDirection })
    };
}

export default async function ForecastPage({ params }: Props) {
    const { locale, direction, date } = await params;
    const t = await getTranslations({ locale, namespace: 'ForecastDetail' });

    // Map URL slug to backend enums
    let dirEnum = "";

    if (direction === "vancouver-to-seattle") {
        dirEnum = "SOUTHBOUND";
    } else if (direction === "seattle-to-vancouver") {
        dirEnum = "NORTHBOUND";
    } else {
        notFound();
    }

    const forecast = await getComparisonForecast(date, dirEnum, locale);

    if (!forecast) {
        return (
            <div className="min-h-screen bg-[#F6F8FA] flex flex-col items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                        <h1 className="text-2xl font-[900] text-slate-900 mb-2">{t('forecastUnavailable')}</h1>
                        <p className="text-slate-500 mb-6">
                            {t('forecastUnavailableDesc', { date })}
                        </p>
                        <a href="/" className="inline-block bg-slate-900 text-white font-bold py-3 px-6 rounded-xl hover:bg-slate-800 transition-colors">
                            {t('returnHome')}
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return <ForecastDetailView forecast={forecast} />;
}
