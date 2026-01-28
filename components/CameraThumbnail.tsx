"use client";

import { useState, useEffect } from "react";
import { clsx } from "clsx";
import { getBaseUrl } from "@/lib/api";
import { CameraIcon } from "./icons/CameraIcon";
import { AlertCircle, Play } from "lucide-react";

interface CameraThumbnailProps {
    crossingId: string;
    crossingName: string;
    hasCameras: boolean;
    onOpen: () => void;
    className?: string; // Allow custom sizing from parent
}

interface CameraSnapshot {
    url: string;
    name: string;
    available: boolean;
}

// Simple module-level cache to persist data across tab switches (NB/SB)
// This prevents redundant API calls and UI flickering when the user toggles views.
const THUMBNAIL_CACHE: Record<string, { data: CameraSnapshot; timestamp: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function CameraThumbnail({ crossingId, crossingName, hasCameras, onOpen, className }: CameraThumbnailProps) {
    const [snapshot, setSnapshot] = useState<CameraSnapshot | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!hasCameras) {
            setLoading(false);
            return;
        }

        // Check Cache first
        const cached = THUMBNAIL_CACHE[crossingId];
        const now = Date.now();
        if (cached && (now - cached.timestamp < CACHE_TTL)) {
            setSnapshot(cached.data);
            setLoading(false);
            return;
        }

        const fetchThumbnail = async () => {
            try {
                const baseUrl = getBaseUrl();
                const res = await fetch(`${baseUrl}/api/v1/cameras/${crossingId}`);

                if (!res.ok) throw new Error("Failed to fetch");

                const data = await res.json();
                if (data && data.length > 0) {
                    const firstSnapshot = data[0];
                    setSnapshot(firstSnapshot);
                    // Update Cache
                    THUMBNAIL_CACHE[crossingId] = {
                        data: firstSnapshot,
                        timestamp: Date.now()
                    };
                } else {
                    setError(true);
                }
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchThumbnail();
    }, [crossingId, hasCameras]);

    if (!hasCameras) return null;

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                onOpen();
            }}
            className={clsx(
                "relative shrink-0 overflow-hidden rounded-xl border border-slate-200 shadow-sm cursor-pointer group/thumb hover:ring-2 hover:ring-indigo-200 transition-all",
                className || "w-24 h-24 sm:w-28 sm:h-28" // Default size if not provided
            )}
        >
            {loading ? (
                <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                </div>
            ) : error || !snapshot ? (
                <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center text-slate-300">
                    <CameraIcon className="w-8 h-8 opacity-50" />
                    <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">No Feed</span>
                </div>
            ) : (
                <>
                    <img
                        src={snapshot.url}
                        alt={`Live feed for ${crossingName}`}
                        className="w-full h-full object-cover transform group-hover/thumb:scale-105 transition-transform duration-500"
                        onError={() => setError(true)}
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 group-hover/thumb:opacity-40 transition-opacity" />

                    {/* Live Badge */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded shadow-sm backdrop-blur-sm">
                        <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                        CAM
                    </div>

                    {/* Play Icon (Centered) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300">
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-sm border border-white/30">
                            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
