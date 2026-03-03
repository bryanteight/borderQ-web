"use client";

import { Link } from "@/i18n/navigation";
import { ArrowLeft, Users, MapPin, Sparkles, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AboutPage() {
    const t = useTranslations('About');
    const tCommon = useTranslations('Common');
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors bg-slate-100/50 hover:bg-blue-50 px-3 py-2 rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium text-sm">{tCommon('backToDashboard')}</span>
                        </Link>
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 hidden sm:block">
                            {t('title')}
                        </h1>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-12">

                {/* Hero Section */}
                <section className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold">
                        <Sparkles className="w-4 h-4" />
                        {t('beta')}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                        {t('heroTitle')}
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        {t.rich('heroDesc', {
                            bold: (chunks) => <strong>{chunks}</strong>
                        })}
                    </p>
                </section>

                {/* Why We Built This */}
                <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 space-y-6">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                            <Users className="w-4 h-4" />
                        </div>
                        {t('whyTitle')}
                    </h3>

                    <div className="space-y-4 text-slate-600 leading-relaxed">
                        <p>
                            {t.rich('why1', { bold: (chunks) => <strong>{chunks}</strong> })}
                        </p>
                        <p>
                            {t.rich('why2', { bold: (chunks) => <strong>{chunks}</strong> })}
                        </p>
                        <p>
                            {t.rich('why3', { bold: (chunks) => <strong>{chunks}</strong> })}
                        </p>
                    </div>
                </section>

                {/* Data Sources */}
                {/* Hybrid Intelligence */}
                <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 space-y-6">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <MapPin className="w-4 h-4" />
                        </div>
                        {t('hybridTitle')}
                    </h3>

                    <div className="space-y-4 text-slate-600 leading-relaxed">
                        <p>
                            {t('hybrid1')}
                        </p>
                        <p>
                            {t.rich('hybrid2', { bold: (chunks) => <strong>{chunks}</strong> })}
                        </p>
                    </div>

                    <ul className="space-y-2 text-sm text-slate-500 bg-slate-50 p-4 rounded-xl">
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>{t('hybridPoint1')}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>{t('hybridPoint2')}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>{t('hybridPoint3')}</span>
                        </li>
                    </ul>
                </section>

                {/* Dynamics Vector Engine */}
                <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 space-y-6">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        {t('dynamicsTitle')}
                    </h3>

                    <div className="space-y-4 text-slate-600 leading-relaxed">
                        <p>
                            {t('dynamics1')}
                        </p>
                        <p>
                            {t.rich('dynamics2', { bold: (chunks) => <strong>{chunks}</strong> })}
                        </p>
                        <p>
                            {t.rich('dynamics3', {
                                surgeBadge: () => (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold rounded-md">
                                        {t('surgeAhead')}
                                    </span>
                                )
                            })}
                        </p>
                    </div>
                </section>

                {/* Beta Notice */}
                <section className="bg-indigo-50 rounded-3xl p-8 md:p-12 border border-indigo-100 space-y-4 text-center">
                    <h3 className="text-xl font-bold text-indigo-900">{t('learningTitle')}</h3>
                    <p className="text-indigo-700 leading-relaxed">
                        {t('learning1')}
                    </p>
                    <p className="text-indigo-700 leading-relaxed">
                        {t('learning2')}
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition-colors"
                    >
                        <MessageSquare className="w-4 h-4" />
                        {t('sendFeedback')}
                    </Link>
                </section>

            </main>
        </div>
    );
}
