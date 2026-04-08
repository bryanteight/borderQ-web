"use client";

import { useState, useEffect, useRef } from "react";
import { Info, AlertCircle, ChevronDown, ChevronUp, X } from "lucide-react";
import { useTranslations } from "next-intl";

export function SpringBreakAlert() {
  const t = useTranslations("Home");
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const alertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const today = new Date();
    const month = today.getMonth(); // 0-indexed, 3 is April
    const date = today.getDate();

    // Active during April 1 to April 14
    if (month === 3 && date >= 1 && date <= 14) {
      setIsVisible(true);
    }
    
    // Close on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (alertRef.current && !alertRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  if (!isVisible) return null;

  return (
    <div 
      ref={alertRef}
      className={`mb-4 md:mb-6 rounded-xl border transition-all duration-300 ease-in-out ${
        isExpanded 
          ? "border-amber-300 bg-amber-50 shadow-md ring-1 ring-amber-200" 
          : "border-amber-200 bg-amber-50 shadow-sm"
      } overflow-hidden`}
    >
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-amber-100/30 transition-colors select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg transition-colors ${isExpanded ? "bg-amber-200" : "bg-amber-100"}`}>
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="font-semibold text-amber-900 text-sm md:text-base tracking-tight">
            {t("springBreakAlert")}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="p-1 rounded-full hover:bg-amber-200 text-amber-500 transition-colors"
            aria-label="Info Toggle"
          >
            {isExpanded ? <X className="w-5 h-5 pointer-events-none" /> : <Info className="w-5 h-5 pointer-events-none" />}
          </button>
        </div>
      </div>
      
      {/* Animated Detail Section */}
      <div 
        className={`grid transition-all duration-300 ease-in-out ${
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div 
            className="px-4 pb-4 pt-1 border-t border-amber-200/50 text-sm md:text-[15px] text-amber-900/80 leading-relaxed bg-white/40 cursor-pointer"
            onClick={() => setIsExpanded(false)}
          >
            <p className="bg-amber-100/30 p-3 rounded-lg border border-amber-200/20 italic">
              {t("springBreakDetail")}
            </p>
            <div className="mt-2 text-[11px] text-amber-600 font-medium uppercase tracking-wider flex justify-center opacity-60">
              Click anywhere to close
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
