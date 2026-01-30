"use client";

import { useState, useRef, useEffect } from "react";
import { HelpCircle, X } from "lucide-react";
import { clsx } from "clsx";

interface TooltipProps {
    content: string;
    id: string; // Unique ID for localStorage tracking (optional future use)
    className?: string;
    align?: "left" | "right" | "center";
    side?: "top" | "bottom";
}

export function Tooltip({ content, id, className, align = "center", side = "top" }: TooltipProps) {
    const [isOpen, setIsOpen] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <div className={clsx("relative inline-flex", className)} ref={tooltipRef}>
            {/* Trigger Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="p-1 text-slate-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-indigo-50"
                aria-label="More info"
            >
                <HelpCircle className="w-3.5 h-3.5" />
            </button>

            {/* Popover */}
            {isOpen && (
                <div className={clsx(
                    "absolute z-[100] w-max max-w-[200px] sm:max-w-[260px] animate-in fade-in duration-200",
                    side === "top" ? "bottom-full mb-2 slide-in-from-bottom-2" : "top-full mt-2 slide-in-from-top-2",
                    align === "center" && "left-1/2 -translate-x-1/2",
                    align === "right" && "right-0",
                    align === "left" && "left-0"
                )}>
                    <div className="bg-slate-900/85 backdrop-blur-lg text-white text-[13px] sm:text-[14px] font-medium leading-snug p-3 sm:p-4 rounded-2xl shadow-2xl border border-white/10 relative">
                        {/* Close Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(false);
                            }}
                            className="absolute top-1 right-1 p-1 text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>

                        <p className="normal-case tracking-normal antialiased whitespace-normal">
                            {content}
                        </p>

                        {/* Arrow */}
                        <div className={clsx(
                            "absolute -mt-px",
                            side === "top" ? "top-full" : "bottom-full rotate-180 mb-[-1px]",
                            align === "center" && "left-1/2 -translate-x-1/2",
                            align === "right" && "right-2",
                            align === "left" && "left-2"
                        )}>
                            <div className="w-2.5 h-2.5 bg-[#0f172a] rotate-45 border-b border-r border-white/10" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
