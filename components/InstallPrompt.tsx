'use client';

import { useState, useEffect } from 'react';
import { PlusSquare, X } from 'lucide-react';
import { clsx } from "clsx";
import { AnimatePresence, motion } from "framer-motion";

export function InstallPrompt() {
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

        // 1. Setup Manual Trigger (Always Active, even if standalone detection is flaky)
        const handleManualTrigger = () => {
            console.log("InstallPrompt: Manual trigger received!");
            setShowPrompt(true);
        };
        window.addEventListener('borderq-install-intent', handleManualTrigger);
        console.log("InstallPrompt: Event listener attached");

        // 2. Setup Auto-Show Timer (Only if NOT standalone)
        // 2. Check Permanent Dismissal (Installed)
        const isPermanentlyDismissed = localStorage.getItem('pwa_installed') === 'true';

        // 3. Setup Auto-Show Timer (Only if NOT standalone AND NOT permanently dismissed)
        if (isStandalone || isPermanentlyDismissed) return;

        const lastDismissal = localStorage.getItem('installPromptDismissed');
        const isDismissedRecently = lastDismissal && Date.now() - parseInt(lastDismissal) < 30 * 24 * 60 * 60 * 1000;

        let timer: NodeJS.Timeout;

        if (!isDismissedRecently) {
            // Detect iOS for specific logic if needed
            const userAgent = window.navigator.userAgent.toLowerCase();
            const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
            setIsIOS(isIosDevice);

            // Show prompt after 10 seconds
            timer = setTimeout(() => {
                setShowPrompt(true);
            }, 10000);
        } else {
            // Still need to detect iOS for the manual trigger case
            const userAgent = window.navigator.userAgent.toLowerCase();
            setIsIOS(/iphone|ipad|ipod/.test(userAgent));
        }

        // 4. Listen for successful installation to permanently silence
        const handleAppInstalled = () => {
            console.log("InstallPrompt: App allowed/installed");
            localStorage.setItem('pwa_installed', 'true');
            setShowPrompt(false);
        };
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            if (timer) clearTimeout(timer);
            window.removeEventListener('borderq-install-intent', handleManualTrigger);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const dismissPrompt = () => {
        setShowPrompt(false);
        localStorage.setItem('installPromptDismissed', Date.now().toString());
    };

    if (!showPrompt) return null;

    return (
        <AnimatePresence>
            {showPrompt && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
                >
                    <div className="bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl rounded-2xl p-4 w-full max-w-sm pointer-events-auto relative">
                        <button
                            onClick={dismissPrompt}
                            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 p-1"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex items-start gap-4 pr-6">
                            {/* Icon Placeholder or App Icon */}
                            <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-xl">
                                📱
                            </div>

                            <div className="flex flex-col gap-1">
                                <h3 className="font-bold text-slate-900 text-sm">
                                    Keep BorderQ Handy
                                </h3>
                                <p className="text-xs text-slate-600 leading-snug">
                                    Save this app to check wait times instantly.
                                    {isIOS ? (
                                        <span> Tap <span className="inline-flex align-middle mx-0.5"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800 mb-1"><path d="M8 6H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg></span> and select <strong> 'Add to Home Screen'</strong></span>
                                    ) : (
                                        <span> Add to your home screen for quick access.</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
