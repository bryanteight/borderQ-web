import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-[#F6F8FA] font-sans pb-20">
            <div className="max-w-3xl mx-auto px-6 py-12">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <h1 className="text-3xl font-[800] text-slate-900 mb-8">Privacy Policy</h1>

                <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-800 prose-li:text-slate-800 text-slate-800">
                    <p className="text-sm text-slate-600 mb-8 font-medium">Last Updated: {new Date().toLocaleDateString()}</p>

                    <h3>1. Data Collection</h3>
                    <p>
                        BorderQ is designed to prioritize user privacy.
                    </p>
                    <ul>
                        <li>We <strong>do not</strong> require user accounts or login.</li>
                        <li>We <strong>do not</strong> track your precise real-time location.</li>
                    </ul>

                    <h3>2. Usage Data & AI Queries</h3>
                    <p>
                        We may collect anonymous usage data (such as page views or button clicks) to help us improve the app structure.
                        If you use the interactive features, your queries are processed by our backend and sent to third-party AI providers (e.g., OpenAI) to generate responses. We do not use your queries to train our own models, but third-party providers may retain data for a short period for abuse monitoring.
                    </p>
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 my-4 text-amber-900 text-sm">
                        <strong>Important:</strong> Please do not enter sensitive personal information (such as license plate numbers, passport details, or full names) into any chat interface or search field on this Service.
                    </div>

                    <h3>3. Cookies & Local Storage</h3>
                    <p>
                        We do not use tracking cookies for advertising. We may use local storage on your device solely to remember your preferences (such as your preferred border crossing station or theme settings) to improve your experience.
                    </p>

                    <h3>4. Children's Privacy</h3>
                    <p>
                        Our Service is not directed to children under the age of 13. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                    </p>

                    <h3>5. Contact Us</h3>
                    <p>
                        If you have questions about this Privacy Policy, please contact the BorderQ Team at:
                        <br />
                        <a href="mailto:info@borderq.com" className="text-indigo-600 font-bold hover:underline mt-2 inline-block">info@borderq.com</a>
                    </p>

                </div>
            </div>
        </main>
    );
}
