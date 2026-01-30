"use client";

import { Sparkles, Brain, Zap, ArrowRight, ShieldCheck } from "lucide-react";

interface AIInsightProps {
  content: string;
}

export function AIInsight({ content }: AIInsightProps) {
  if (!content) return null;

  // Simple parser to split by markdown headers (## Title)
  const sections = content.split(/(?=## )/g).map(section => {
    const lines = section.trim().split('\n');
    const title = lines[0].replace('## ', '').trim();
    const body = lines.slice(1).join('\n').trim();
    return { title, body };
  });

  return (
    <div className="relative group overflow-hidden bg-slate-900 rounded-[2.5rem] border border-white/10 shadow-2xl">
      {/* Animated Background Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full group-hover:bg-indigo-600/30 transition-colors duration-700" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full group-hover:bg-blue-600/30 transition-colors duration-700" />

      {/* Main Container */}
      <div className="relative z-10 p-4 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-2 animate-pulse">
              <Zap className="w-3 h-3" />
              Smart Context Active
            </div>
            <h2 className="text-3xl md:text-4xl font-[900] text-white tracking-tight leading-none">
              Traffic <span className="text-indigo-400">Analysis</span>
            </h2>
            <p className="text-slate-400 text-sm md:text-base font-medium">
              Analyzing live traffic against historical trends.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-blue-600 opacity-50" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="relative p-4 md:p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/[0.08] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group/card"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/20 group-hover/card:scale-110 transition-transform duration-300">
                  {idx === 0 ? <Brain className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">{section.title}</h3>
              </div>

              <div className="prose prose-invert prose-slate max-w-none">
                <p className="text-slate-300 leading-relaxed text-sm md:text-[15px] font-medium opacity-90">
                  {section.body}
                </p>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-4 right-4 text-white/5 group-hover/card:text-white/10 transition-colors">
                <ArrowRight className="w-8 h-8 -rotate-45" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
