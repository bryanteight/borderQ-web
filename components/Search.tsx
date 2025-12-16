"use client";

import { useState, ReactElement } from "react";
import { Search as SearchIcon, Send, Loader2, Sparkles, Calendar, AlertTriangle } from "lucide-react";

// --- 1. Helper: Render Markdown with Perfect Alignment ---
// --- 1a. Helper: Render Tables ---
function renderTable(lines: string[], keyIndex: number): ReactElement {
  const rows = lines.map(line => {
    return line.trim().replace(/^\||\|$/g, '').split('|').map(cell => cell.trim());
  });

  if (rows.length === 0) return <></>;

  let headerRow: string[] | null = null;
  let bodyRows = rows;

  // Check for separator row (usually 2nd row)
  if (rows.length >= 2) {
    const separatorCandidate = lines[1].trim().replace(/^\||\|$/g, '').split('|');
    const isSeparator = separatorCandidate.every(cell => /^[\s-:]+$/.test(cell.trim()));

    if (isSeparator) {
      headerRow = rows[0];
      bodyRows = rows.slice(2);
    }
  }

  // Find column indices
  const headerStrings = headerRow ? headerRow.map(h => h.toLowerCase()) : [];
  const adviceIdx = headerStrings.findIndex(h => h.includes("advice") || h.includes("confidence"));
  const portIdx = headerStrings.findIndex(h => h.includes("port"));
  const waitIdx = headerStrings.findIndex(h => h.includes("wait") || h.includes("projected"));

  return (
    <div key={`table-${keyIndex}`} className="overflow-visible my-6 border border-gray-100 rounded-2xl shadow-sm bg-white ring-1 ring-gray-950/5">
      <table className="min-w-full divide-y divide-gray-100">
        {headerRow && (
          <thead className="bg-gray-50/80">
            <tr>
              {headerRow.map((header, idx) => (
                <th key={idx} scope="col" className="px-5 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  {renderRichText(header)}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-gray-50 bg-white">
          {bodyRows.map((row, rIdx) => {
            // Check if this row is for Lynden to show the penalty badge
            const isLynden = portIdx !== -1 && row[portIdx]?.toLowerCase().includes("lynden");

            return (
              <tr key={rIdx} className="group hover:bg-gray-50/60 transition-colors">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-5 py-4 text-sm whitespace-nowrap relative">
                    {/* 1. BADGE LOGIC FOR ADVICE */}
                    {cIdx === adviceIdx ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
                        {renderRichText(cell)}
                      </span>
                    ) :
                      /* 2. PENALTY DOT LOGIC FOR WAIT TIME (ONLY IF LYNDEN) */
                      (cIdx === waitIdx && isLynden) ? (
                        <div className="relative inline-block">
                          <span className="font-bold text-gray-900 group-hover:text-black transition-colors">
                            {renderRichText(cell)}
                          </span>
                          {/* THE RED DOT BADGE */}
                          <span className="absolute -top-3 -right-10 bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow-sm ring-1 ring-white transform scale-90">
                            +20m
                          </span>
                        </div>
                      ) : (
                        <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                          {renderRichText(cell)}
                        </span>
                      )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// --- 1. Helper: Render Markdown with Perfect Alignment ---
function renderMarkdownText(text: string): ReactElement {
  if (!text) return <></>;

  const lines = text.split('\n');
  const elements: ReactElement[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      elements.push(<div key={`spacer-${i}`} className="h-4" />);
      continue;
    }

    // 0. Detect Table Block
    if (trimmedLine.startsWith('|')) {
      const tableLines: string[] = [];
      let j = i;
      while (j < lines.length && lines[j].trim().startsWith('|')) {
        tableLines.push(lines[j]);
        j++;
      }

      if (tableLines.length > 0) {
        elements.push(renderTable(tableLines, i));
        i = j - 1; // Skip handled lines
        continue;
      }
    }

    // A. Detect Headers with Emojis (e.g., "🌅 Morning")
    const headerMatch = trimmedLine.match(/^([🌅☀️🌙⚠️🚀🏆🤖🎄📊🔴🟢✅❌]+)\s*(.*)/);

    if (headerMatch) {
      const emoji = headerMatch[1];
      const content = headerMatch[2];

      // Check for Time Periods (e.g. "Morning (6AM - 12PM)")
      const timeMatch = content.match(/^([^(]+\([^)]+\))\s*(.*)/);

      if (timeMatch) {
        // Styled Time Section Header
        elements.push(
          <div key={`line-${i}`} className="mt-6 first:mt-0 mb-3">
            <div className="flex items-center gap-3 pb-2 border-b border-gray-100 mb-2">
              <span className="text-2xl filter drop-shadow-sm select-none">{emoji}</span>
              <span className="font-bold text-gray-900 text-lg tracking-tight">{timeMatch[1]}</span>
            </div>
            {/* Indent body to match header text start */}
            <div className="pl-1 text-gray-900 leading-relaxed text-base font-medium text-left" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
              {renderRichText(timeMatch[2] || "")}
            </div>
          </div>
        );
      } else {
        // Standard Bullet Point with Emoji
        elements.push(
          <div key={`line-${i}`} className="flex items-start gap-3 mb-3">
            {/* Fixed width container ensures perfect vertical alignment */}
            <div className="w-6 flex justify-center shrink-0 mt-0.5 text-xl select-none">
              {emoji}
            </div>
            <div className="flex-1 text-gray-900 leading-relaxed text-base font-medium text-left" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
              {renderRichText(content)}
            </div>
          </div>
        );
      }
    }
    // B. Detect Standard Lists ("- " or "* ")
    else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      const content = trimmedLine.substring(2);
      elements.push(
        <div key={`list-${i}`} className="flex items-start gap-3 mb-2 group">
          {/* Centering the bullet relative to text line height */}
          <div className="w-6 flex justify-center shrink-0 mt-[0.6rem]">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-400 group-hover:bg-blue-400 transition-colors"></span>
          </div>
          <div className="flex-1 text-gray-900 leading-relaxed text-base font-medium text-left" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
            {renderRichText(content)}
          </div>
        </div>
      );
    }
    // C. Regular Paragraphs
    else {
      elements.push(
        <div key={`para-${i}`} className="mb-3 text-gray-900 leading-relaxed text-base font-medium text-left" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
          {renderRichText(trimmedLine)}
        </div>
      );
    }
  }

  return <>{elements}</>;
}

// --- 2. Helper: Smart Text Processing (Bold Markdown + Auto-Highlight Numbers) ---
function renderRichText(text: string): ReactElement {
  if (!text) return <></>;

  const parts: ReactElement[] = [];
  let lastIndex = 0;
  const boldRegex = /\*\*([^*]+)\*\*/g;
  let match;

  while ((match = boldRegex.exec(text)) !== null) {
    // 1. Process text BEFORE the bold section
    if (match.index > lastIndex) {
      // FIX: Added a unique key based on the index to this wrapper
      parts.push(
        <span key={`text-${lastIndex}`}>
          {highlightNumbers(text.substring(lastIndex, match.index))}
        </span>
      );
    }

    // 2. Render the **bold** section
    parts.push(
      <strong key={`bold-${match.index}`} className="font-bold text-gray-900">
        {match[1]}
      </strong>
    );
    lastIndex = match.index + match[0].length;
  }

  // 3. Process remaining text
  if (lastIndex < text.length) {
    // FIX: Added a unique key here too
    parts.push(
      <span key={`text-${lastIndex}`}>
        {highlightNumbers(text.substring(lastIndex))}
      </span>
    );
  }

  // If we didn't split anything (no bold text), just return the simple result
  if (parts.length === 0) {
    return highlightNumbers(text);
  }

  return <>{parts}</>;
}

// --- 3. Sub-Helper: Auto-Highlight Numbers and Times ---
function highlightNumbers(text: string): ReactElement {
  // Regex matches:
  // 1. Durations: "10 mins", "5-10 minutes", "45 min"
  // 2. Times: "7 PM", "10:30 AM"
  // 3. Comparisons: "15 minutes faster"
  const numberRegex = /(\d+(?:-\d+)?\s*(?:min|mins|minute|minutes|hr|hours|AM|PM))|(\d{1,2}:\d{2}\s*(?:AM|PM))/gi;

  const parts = text.split(numberRegex);

  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        // If part matches our regex pattern, make it bold/dark
        if (part.match(numberRegex)) {
          return (
            <span key={i} className="font-bold text-gray-900 tabular-nums tracking-tight">
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

// --- 4. Helper: Clean Title Logic ---
function extractRecommendation(text: string): { title: string; body: string } {
  const titlePattern = /(?:recommend|suggest|best bet|choose|take|go for|use|option is)\s+([^.!?\n]+)/i;
  const match = text.match(titlePattern);

  if (match && match[1]) {
    const rawTitle = match[1].trim();
    let cleanTitle = rawTitle
      .replace(/^(the following:?|:)/i, "")
      .replace(/[\-–—]+$/, "")
      .trim();

    cleanTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
    const body = text.replace(match[0], "").replace(/^[.!?\s,]+/, "").trim();

    return { title: cleanTitle, body };
  }

  return { title: "", body: text };
}

// --- 5. Helper: Determine Theme Mode ---
function getThemeMode(text: string) {
  const t = text.toLowerCase();
  if (t.includes("tomorrow") || t.includes("sunday") || t.includes("monday") || t.includes("forecast") || t.includes("expect") || t.includes("historical")) {
    return "forecast";
  }
  if ((t.includes("heavy") || t.includes("avoid") || t.includes("delay")) && !t.includes("no delay")) {
    return "warning";
  }
  return "live";
}

// --- MAIN COMPONENT ---
interface SearchProps {
  hints?: string[];
  placeholderText?: string;
}

export function Search({ hints = [], placeholderText = "Ask AI... (e.g. 'Is Sunday busy?')" }: SearchProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<any>(null);

  const performSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setAnswer(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${baseUrl}/api/v1/ask?query=` + encodeURIComponent(q), {
        method: "POST"
      });
      const data = await res.json();
      setAnswer(data);
    } catch (err) {
      setAnswer({ ai_answer: "Sorry, I couldn't reach the border agent right now." });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await performSearch(query);
  };

  const handleHintClick = async (hint: string) => {
    setQuery(hint);
    await performSearch(hint);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 px-4 sm:px-0">
      <form onSubmit={handleSearch} className="relative group z-20">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-14 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-base"
          placeholder={placeholderText}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute inset-y-2 right-2 px-4 flex items-center bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </form>

      {/* Hint pills */}
      {hints.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 justify-center text-sm text-gray-600">
          {hints.map((hint) => (
            <button
              key={hint}
              type="button"
              onClick={() => handleHintClick(hint)}
              className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-colors"
            >
              {hint}
            </button>
          ))}
        </div>
      )}

      {/* RESULT CARD */}
      {answer && (
        <div className="mt-6 animate-in fade-in slide-in-from-top-4 duration-500">
          {answer.type === "off_topic" ? (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
              <div className="text-red-700 font-medium text-sm leading-relaxed">{answer.message}</div>
            </div>
          ) : (
            (() => {
              const fullText = answer.ai_answer || answer.message;
              const { title, body } = extractRecommendation(fullText);
              const theme = getThemeMode(fullText);

              // Theme Configuration
              const themes = {
                live: {
                  gradient: "from-emerald-400 to-teal-500",
                  border: "border-emerald-100",
                  bg: "bg-white",
                  icon: <Sparkles className="w-5 h-5 text-emerald-600" />,
                  titleColor: "text-emerald-900",
                  badge: "Live Analysis"
                },
                forecast: {
                  gradient: "from-amber-400 to-orange-500",
                  border: "border-amber-100",
                  bg: "bg-white",
                  icon: <Calendar className="w-5 h-5 text-amber-600" />,
                  titleColor: "text-amber-900",
                  badge: "Historical Forecast"
                },
                warning: {
                  gradient: "from-red-400 to-rose-500",
                  border: "border-red-100",
                  bg: "bg-white",
                  icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
                  titleColor: "text-red-900",
                  badge: "Traffic Alert"
                }
              };

              const activeTheme = themes[theme];

              return (
                <div className={`relative overflow-hidden rounded-3xl border ${activeTheme.border} ${activeTheme.bg} shadow-xl shadow-gray-200/50`}>
                  {/* 1. Top Gradient Bar */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${activeTheme.gradient} opacity-90`} />

                  <div className="p-8">
                    {/* 2. Header Section */}
                    <div className="flex items-start gap-4 mb-8">
                      <div className="p-2.5 bg-gray-50 rounded-2xl shrink-0 border border-gray-100 shadow-sm">
                        {activeTheme.icon}
                      </div>
                      <div>
                        <div className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1">
                          {activeTheme.badge}
                        </div>
                        <h3 className={`font-bold text-2xl leading-tight ${activeTheme.titleColor} text-left tracking-tight`}>
                          {title || "Traffic Analysis"}
                        </h3>
                      </div>
                    </div>

                    {/* 3. Body Content */}
                    <div className="prose prose-lg max-w-none text-gray-900 text-left font-medium font-sans" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
                      {renderMarkdownText(body)}
                    </div>

                    {/* 4. Footer Disclaimer (Forecasts & Lynden Penalty) */}
                    <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-2">
                      {/* Standard Forecast Disclaimer */}
                      {theme === 'forecast' && (
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Prediction based on historical averages</span>
                        </div>
                      )}

                      {/* Lynden Penalty Disclaimer - Only show if Lynden is present in the text */}
                      {body.toLowerCase().includes("lynden") && (
                        <div className="flex items-center gap-2 text-[10px] text-rose-400 font-bold uppercase tracking-widest">
                          <span className="w-3.5 h-3.5 flex items-center justify-center bg-rose-100 rounded-full text-[8px]">+</span>
                          <span>20m: Estimated highway detour time vs Peace Arch</span>
                        </div>
                      )}

                      {/* 5. SEO Button (View Full Forecast) */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => window.location.href = '/analysis/peace-arch-sunday-traffic'} // Placeholder link
                          className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-slate-200 active:scale-95"
                        >
                          <Sparkles className="w-4 h-4 text-emerald-400" />
                          <span>See Full AI Insight & Trends</span>
                        </button>
                        <p className="text-center text-[10px] text-gray-400 mt-2 font-medium">
                          Detailed hourly breakdown available on full report
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      )}
    </div>
  );
}