import { Sparkles } from "lucide-react";

interface AIInsightProps {
  summary: string;
}

export function AIInsight({ summary }: AIInsightProps) {
  if (!summary) return null;

  return (
    <div className="mt-6 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 rounded-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles className="w-24 h-24 text-blue-600" />
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          <Sparkles className="w-4 h-4 text-indigo-600" />
        </div>
        <h3 className="font-bold text-indigo-900">AI Traffic Analysis</h3>
      </div>
      
      <p className="text-indigo-800 leading-relaxed text-sm md:text-base">
        {summary}
      </p>
    </div>
  );
}
