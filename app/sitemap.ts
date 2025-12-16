import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://borderq.com'; // Replace with actual domain when live (or process.env.NEXT_PUBLIC_URL)

    // 1. Static Pages
    const staticRoutes = [
        '',
        '/privacy',
        '/terms',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1.0 : 0.5,
    }));

    // Start with Standard Days
    const days = [
        'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
        // High-value Holidays (Matched to Backend HOLIDAY_ALIASES)
        'christmas', 'thanksgiving', 'new-years-day', 'canada-day', 'independence-day'
    ];

    const ports = [
        'peace-arch',
        'pacific-highway',
        'lynden'
    ];

    // 2. Aggregate Stats Pages (Regional)
    // /stats/seattle-to-vancouver/[day]
    const aggregateRoutes = days.map((day) => ({
        url: `${baseUrl}/stats/seattle-to-vancouver/${day}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // 3. Single Port Stats Pages
    // /stats/[port]/[day]
    const portRoutes = ports.flatMap((port) =>
        days.map((day) => ({
            url: `${baseUrl}/stats/${port}/${day}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }))
    );

    return [...staticRoutes, ...aggregateRoutes, ...portRoutes];
}
