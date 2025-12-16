import Link from 'next/link';

export function SiteFooter() {
    return (
        <footer className="py-12 px-6 bg-[#F6F8FA] border-t border-slate-200">
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-6">

                {/* Disclaimer Block */}
                <div className="space-y-2 max-w-2xl">
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        <strong className="text-slate-700">Disclaimer:</strong> BorderQ is an independent tool providing estimates based on historical data and AI analysis. We are not affiliated with U.S. CBP or Canada CBSA.
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Wait times are predictions and not guaranteed. <span className="text-slate-500 font-bold">Please drive safely and do not use this app while operating a vehicle.</span>
                    </p>
                </div>

                {/* Legal Links */}
                <div className="flex items-center gap-6 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <Link href="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</Link>
                    <Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
                </div>

                {/* Version & Copyright */}
                <div className="flex flex-col items-center gap-1">
                    <p className="text-[10px] text-slate-300 font-mono opacity-40 hover:opacity-100 transition-opacity cursor-default select-none">
                        v0.1
                    </p>
                    <p className="text-[10px] text-slate-300">
                        © {new Date().getFullYear()} BorderQ
                    </p>
                </div>
            </div>
        </footer>
    );
}
