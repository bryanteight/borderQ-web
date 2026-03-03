"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Send, CheckCircle, AlertCircle } from "lucide-react";
import { sendContactFeedback } from "@/lib/api";
import { useTranslations } from "next-intl";

export default function ContactPage() {
    const t = useTranslations('Contact');
    const tCommon = useTranslations('Common');
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [errors, setErrors] = useState<{ email?: string; message?: string }>({});

    const validate = () => {
        const newErrors: { email?: string; message?: string } = {};

        if (!email.trim()) {
            newErrors.email = t('emailRequired');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = t('emailInvalid');
        }

        if (!message.trim()) {
            newErrors.message = t('messageRequired');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setStatus("sending");

        try {
            const result = await sendContactFeedback(email, message);
            if (result.success) {
                setStatus("success");
                setEmail("");
                setMessage("");
            } else {
                setStatus("error");
                alert(result.message);
            }
        } catch {
            setStatus("error");
            alert(t('unexpectedError'));
        }
    };

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

            <main className="max-w-xl mx-auto px-4 sm:px-6 py-12">

                {status === "success" ? (
                    <div className="bg-emerald-50 rounded-3xl p-8 md:p-12 border border-emerald-100 text-center space-y-4">
                        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                        <h2 className="text-2xl font-bold text-emerald-900">{t('thankYou')}</h2>
                        <p className="text-emerald-700">
                            {t('successMessage')}
                        </p>
                        <Link
                            href="/"
                            className="inline-block mt-4 px-6 py-3 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-700 transition-colors"
                        >
                            {t('backToHome')}
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 space-y-8">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-slate-900">{t('sendFeedback')}</h2>
                            <p className="text-slate-500">
                                {t('sendFeedbackDesc')}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-bold text-slate-700">
                                    {t('emailLabel')} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t('emailPlaceholder')}
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all`}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Message Field */}
                            <div className="space-y-2">
                                <label htmlFor="message" className="block text-sm font-bold text-slate-700">
                                    {t('messageLabel')} <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder={t('messagePlaceholder')}
                                    rows={5}
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.message ? 'border-red-300 bg-red-50' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all resize-none`}
                                />
                                {errors.message && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.message}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={status === "sending"}
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === "sending" ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        {t('sending')}
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        {t('send')}
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="text-center text-xs text-slate-400">
                            {t('orEmailText')}
                            <a href="mailto:info@borderq.com" className="text-indigo-600 font-bold hover:underline">
                                info@borderq.com
                            </a>
                        </p>
                    </div>
                )}

            </main>
        </div>
    );
}
