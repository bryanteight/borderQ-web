'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleLocaleChange = (newLocale: string) => {
        // Keep existing query parameters
        const params = new URLSearchParams(searchParams.toString());
        const query = params.toString() ? `?${params.toString()}` : '';

        router.replace(`${pathname}${query}`, { locale: newLocale });
    };

    return (
        <div className="relative group flex items-center">
            <div className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer px-2 py-1.5 rounded-md hover:bg-slate-100">
                <Globe className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wide">
                    {locale === 'zh-CN' ? '简' : locale === 'zh-TW' ? '繁' : 'EN'}
                </span>
            </div>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                    <button
                        onClick={() => handleLocaleChange('en')}
                        className={`w-full text-left px-4 py-2 text-sm font-medium ${locale === 'en' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => handleLocaleChange('zh-CN')}
                        className={`w-full text-left px-4 py-2 text-sm font-medium ${locale === 'zh-CN' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                        简体中文
                    </button>
                    <button
                        onClick={() => handleLocaleChange('zh-TW')}
                        className={`w-full text-left px-4 py-2 text-sm font-medium ${locale === 'zh-TW' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                        繁體中文
                    </button>
                </div>
            </div>
        </div>
    );
}
