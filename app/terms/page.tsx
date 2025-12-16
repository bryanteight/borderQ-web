import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[#F6F8FA] font-sans pb-20">
            <div className="max-w-3xl mx-auto px-6 py-12">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <h1 className="text-3xl font-[800] text-slate-900 mb-8">Terms of Service</h1>

                <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-800 prose-li:text-slate-800 text-slate-800">
                    <p className="text-sm text-slate-600 mb-8 font-medium">Last Updated: {new Date().toLocaleDateString()}</p>

                    <h3>1. Acceptance of Terms</h3>
                    <p>
                        By accessing or using BorderQ ("the Service"), you agree to be bound by these Terms of Service.
                        If you do not agree to these terms, please do not use the Service.
                    </p>

                    <h3>2. "As-Is" and No Warranty</h3>
                    <p className="uppercase font-bold text-xs tracking-wider text-slate-700">Important</p>
                    <p>
                        The Service is provided on an 'AS IS' and 'AS AVAILABLE' basis. BorderQ makes no representations or warranties of any kind, express or implied, regarding the accuracy, reliability, or completeness of the wait time predictions, traffic data, or AI-generated responses.
                    </p>

                    <h3>3. Limitation of Liability</h3>
                    <p>
                        In no event shall BorderQ, its creators, or affiliates be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including but not limited to damages for loss of profits, goodwill, use, data, or other intangible losses (even if we have been advised of the possibility of such damages), resulting from:
                    </p>
                    <ul>
                        <li>The use or the inability to use the Service;</li>
                        <li>Missed flights, travel delays, fuel costs, or other travel-related expenses;</li>
                        <li>Reliance on any information or predictions provided by the Service.</li>
                    </ul>

                    <h3>4. AI & Hallucinations</h3>
                    <p>
                        Users acknowledge that this Service utilizes Artificial Intelligence (AI). AI predictions and responses may occasionally be inaccurate, misleading, or outdated ("hallucinations").
                        <strong>Users should strictly verify critical information through official government sources (e.g., CBP/CBSA websites) before making travel plans.</strong>
                    </p>

                    <h3>5. Safe Driving Agreement</h3>
                    <p>
                        You agree not to use this Service while operating a moving vehicle. Always drive safely and obey traffic laws.
                        <strong>BorderQ is not responsible for any accidents or violations resulting from distracted driving.</strong>
                    </p>

                    <h3>6. Not Government Affiliated</h3>
                    <p>
                        BorderQ is an independent project and is <strong>not affiliated, endorsed, or sponsored by</strong> U.S. Customs and Border Protection (CBP), Canada Border Services Agency (CBSA), or any other government entity.
                    </p>

                    <h3>7. Governing Law</h3>
                    <p>
                        These Terms shall be governed and construed in accordance with the laws of the State of Washington, United States, without regard to its conflict of law provisions.
                    </p>

                    <h3>8. Changes to Service</h3>
                    <p>
                        We reserve the right to withdraw or amend the Service, and any service or material we provide on the Service, in our sole discretion without notice. We will not be liable if for any reason all or any part of the Service is unavailable at any time or for any period.
                    </p>
                </div>
            </div>
        </main>
    );
}
