import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['en', 'zh-CN', 'zh-TW'],

    // Used when no locale matches
    defaultLocale: 'en',

    // Don't prefix the default locale (English) to preserve existing SEO
    localePrefix: 'as-needed'
});
