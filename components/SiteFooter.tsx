"use client";

import { Link } from '@/i18n/navigation';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Car } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function SiteFooter() {
    const t = useTranslations('Footer');
    const [isExpanded, setIsExpanded] = useState(false);
    const [isStandalone, setIsStandalone] = useState(true); // Default to true (hidden) to prevent flash

    useEffect(() => {
        // Check if running in standalone mode
        const checkStandalone = () => {
            const isApp = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
            setIsStandalone(!!isApp);
        };

        checkStandalone();
        window.addEventListener('resize', checkStandalone); // Re-check on resize (optional but good for testing)

        return () => window.removeEventListener('resize', checkStandalone);
    }, []);

    return (
        <footer className="py-12 px-6 bg-[#F6F8FA] border-t border-slate-200">
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8">

                {/* 1. Install App Call-to-Action (Most Prominent) */}
                {!isStandalone && (
                    <button
                        onClick={() => {
                            console.log("Footer: Dispatching install intent...");
                            window.dispatchEvent(new Event('borderq-install-intent'));
                        }}
                        className="group relative flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 active:scale-95"
                    >
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                        </span>
                        <div className="text-left flex flex-col">
                            <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{t('addToHomeScreen')}</span>
                            <span className="text-[10px] text-slate-500 font-medium">{t('getUpdates')}</span>
                        </div>
                    </button>
                )}

                {/* 2. Disclaimer Block */}
                <div className="space-y-4 max-w-2xl text-center">
                    {/* PAX Definition Badge */}
                    <div className="flex items-center justify-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-100 shadow-sm">
                            <Car className="w-3.5 h-3.5" />
                            <span>{t('paxDefinition')}</span>
                        </div>

                    </div>

                    {/* Mobile: Toggle Button */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="md:hidden flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wide w-full"
                    >
                        <span>{t('safetyInfo')}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {/* Content: Hidden on Mobile unless Expanded, Always Visible on Desktop */}
                    <div className={`${isExpanded ? 'block' : 'hidden'} md:block space-y-2 transition-all duration-300`}>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            <strong className="text-slate-700">Disclaimer:</strong> {t('disclaimerBase')}
                        </p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            {t('disclaimerWarning')} <span className="text-slate-500 font-bold">{t('driveSafely')}</span>
                        </p>
                    </div>
                </div>

                {/* Legal Links */}
                <div className="flex flex-wrap justify-center gap-6 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <Link href="/vectors" className="hover:text-indigo-600 transition-colors">{t('links.howItWorks')}</Link>
                    <Link href="/about" className="hover:text-indigo-600 transition-colors">{t('links.about')}</Link>
                    <a href="https://x.com/BorderqAI" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">{t('links.followX')}</a>
                    <Link href="/contact" className="hover:text-indigo-600 transition-colors">{t('links.contact')}</Link>
                    <Link href="/terms" className="hover:text-indigo-600 transition-colors">{t('links.terms')}</Link>
                    <Link href="/privacy" className="hover:text-indigo-600 transition-colors">{t('links.privacy')}</Link>
                </div>

                {/* Version & Copyright */}
                <div className="flex flex-col items-center gap-1">
                    <p className="text-xs text-slate-400">BorderQ AI v0.7.14 &copy; {new Date().getFullYear()}</p>
                </div>
            </div>
        </footer>
    );
}
