import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://borderq.com'; // Replace with actual domain when live (or process.env.NEXT_PUBLIC_URL)

    const generateAlternates = (urlPath: string) => {
        const path = urlPath.startsWith('/') ? urlPath : `/${urlPath}`;
        const cleanPath = path === '/' ? '' : path;
        return {
            url: `${baseUrl}${cleanPath}`,
            alternates: {
                languages: {
                    'en': `${baseUrl}${cleanPath}`,
                    'zh-CN': `${baseUrl}/zh-CN${cleanPath}`,
                    'zh-TW': `${baseUrl}/zh-TW${cleanPath}`,
                }
            }
        };
    };

    // 1. Static Pages
    const staticRoutes = [
        '',
        '/about',
        '/contact',
        '/vectors',
        '/privacy',
        '/terms',
    ].map((route) => ({
        ...generateAlternates(route),
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1.0 : 0.8,
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

    // 2. Crossing Hub Pages (New)
    // /crossing/[port]
    const crossingRoutes = ports.map((port) => ({
        ...generateAlternates(`/crossing/${port}`),
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }));

    // 3. Aggregate Stats Pages (Regional)
    // /stats/vancouver-to-seattle/[day] and /stats/seattle-to-vancouver/[day]
    const aggregateRoutes = [
        ...days.map((day) => ({
            ...generateAlternates(`/stats/vancouver-to-seattle/${day}`),
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        })),
        ...days.map((day) => ({
            ...generateAlternates(`/stats/seattle-to-vancouver/${day}`),
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }))
    ];

    // 4. Single Port Stats Pages
    // /stats/[port]/[day]
    const portRoutes = ports.flatMap((port) =>
        days.map((day) => ({
            ...generateAlternates(`/stats/${port}/${day}`),
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }))
    );

    return [...staticRoutes, ...crossingRoutes, ...aggregateRoutes, ...portRoutes];
}
