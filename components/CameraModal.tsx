"use client";

import { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight, AlertCircle, Maximize2, RotateCw } from "lucide-react";
import { getBaseUrl } from "@/lib/api";
import { CameraIcon } from "./icons/CameraIcon";
import { clsx } from "clsx";

interface CameraSnapshot {
    url: string;
    name: string;
    description: string;
    last_updated: string | null;
    available: boolean;
}

interface CameraModalProps {
    crossingId: string;
    crossingName: string;
    isOpen: boolean;
    onClose: () => void;
}

export function CameraModal({ crossingId, crossingName, isOpen, onClose }: CameraModalProps) {
    const [snapshots, setSnapshots] = useState<CameraSnapshot[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isRotated, setIsRotated] = useState(false);
    const touchStart = useRef<number | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        const fetchSnapshots = async () => {
            setLoading(true);
            setError(null);
            try {
                const baseUrl = getBaseUrl();
                const response = await fetch(`${baseUrl}/api/v1/cameras/${crossingId}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        setError("Cameras only available for southbound traffic");
                    } else {
                        setError("Failed to load camera snapshots");
                    }
                    return;
                }
                const data = await response.json();
                setSnapshots(data);
                setCurrentIndex(0);
            } catch (err) {
                setError("Failed to connect to camera service");
            } finally {
                setLoading(false);
            }
        };

        fetchSnapshots();
    }, [isOpen, crossingId]);

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? snapshots.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === snapshots.length - 1 ? 0 : prev + 1));
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStart.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStart.current === null) return;
        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart.current - touchEnd;

        if (diff > 50) {
            handleNext();
        } else if (diff < -50) {
            handlePrevious();
        }
        touchStart.current = null;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!isOpen) return;
        if (e.key === "Escape") {
            if (isFullscreen) setIsFullscreen(false);
            else onClose();
        }
        if (e.key === "ArrowLeft") handlePrevious();
        if (e.key === "ArrowRight") handleNext();
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, snapshots.length, isFullscreen]);

    if (!isOpen) return null;

    const currentSnapshot = snapshots[currentIndex];

    return (
        <>
            {/* Standard Modal */}
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            >
                <div
                    className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 overflow-hidden animate-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <CameraIcon className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">{crossingName}</h2>
                                <p className="text-sm text-slate-500">Live Camera Feed</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5 text-slate-600" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
                                <p className="text-slate-500 font-medium">Loading camera snapshots...</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <AlertCircle className="w-16 h-16 text-slate-300 mb-4" />
                                <p className="text-slate-600 font-medium mb-2">{error}</p>
                                <p className="text-sm text-slate-400">Cameras are only available for southbound crossings</p>
                            </div>
                        ) : snapshots.length > 0 && currentSnapshot ? (
                            <div className="space-y-4">
                                {/* Camera Info */}
                                <div className="text-center">
                                    <h3 className="text-lg font-bold text-slate-900">{currentSnapshot.name}</h3>
                                    <p className="text-sm text-slate-500">{currentSnapshot.description}</p>
                                </div>

                                {/* Image Container Wrapper */}
                                <div className="flex justify-center overflow-hidden">
                                    <div
                                        className="relative inline-flex justify-center items-center group cursor-zoom-in touch-pan-y"
                                        onClick={() => setIsFullscreen(true)}
                                        onTouchStart={handleTouchStart}
                                        onTouchEnd={handleTouchEnd}
                                    >
                                        {currentSnapshot.available ? (
                                            <>
                                                <img
                                                    src={currentSnapshot.url}
                                                    alt={currentSnapshot.name}
                                                    className="w-full h-auto max-h-[60vh] object-contain rounded-lg transition-transform duration-300 md:group-hover:scale-[1.01]"
                                                    style={{ clipPath: "inset(0 0 6% 0)", marginBottom: "-6%" }}
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23f1f5f9' width='800' height='600'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%2394a3b8'%3ECamera Unavailable%3C/text%3E%3C/svg%3E";
                                                    }}
                                                />
                                                {/* Timestamp Overlay */}
                                                <div className="absolute bottom-1 left-2 text-white/90 text-[10px] md:text-xs font-bold tracking-wide drop-shadow-md pointer-events-none">
                                                    {currentSnapshot.last_updated ? (
                                                        <span>Updated: {new Date(currentSnapshot.last_updated as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    ) : (
                                                        <span>Updated: Live</span>
                                                    )}
                                                </div>

                                                {/* Click Hint (Hidden on touch) */}
                                                <div className="absolute inset-0 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10 rounded-lg pointer-events-none">
                                                    <div className="bg-black/60 text-white px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md flex items-center gap-2">
                                                        <Maximize2 className="w-3 h-3" />
                                                        Click to Expand
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center p-12 text-slate-400">
                                                <AlertCircle className="w-12 h-12 mb-3" />
                                                <p className="font-medium">Camera temporarily unavailable</p>
                                            </div>
                                        )}

                                        {/* Navigation Arrows */}
                                        {snapshots.length > 1 && (
                                            <>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                                                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-10 md:h-10 rounded-full bg-black/20 md:bg-transparent md:hover:bg-white/10 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] flex items-center justify-center transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                                    aria-label="Previous camera"
                                                >
                                                    <ChevronLeft className="w-8 h-8" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-10 md:h-10 rounded-full bg-black/20 md:bg-transparent md:hover:bg-white/10 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] flex items-center justify-center transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                                    aria-label="Next camera"
                                                >
                                                    <ChevronRight className="w-8 h-8" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Pagination Dots */}
                                {snapshots.length > 1 && (
                                    <div className="flex items-center justify-center gap-2 py-2">
                                        <span className="text-xs text-slate-400 font-medium mr-2">
                                            {currentIndex + 1} / {snapshots.length}
                                        </span>
                                        <div className="flex gap-1.5">
                                            {snapshots.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setCurrentIndex(idx)}
                                                    className={clsx(
                                                        "h-1.5 rounded-full transition-all",
                                                        idx === currentIndex ? "bg-indigo-600 w-6" : "bg-slate-200 w-1.5 hover:bg-slate-300"
                                                    )}
                                                    aria-label={`Go to camera ${idx + 1}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Fullscreen Overlay */}
            {isFullscreen && currentSnapshot && (
                <div
                    className="fixed inset-0 z-[60] bg-black flex items-center justify-center animate-in fade-in duration-200"
                    onClick={() => setIsFullscreen(false)}
                >
                    {/* Image */}
                    <img
                        src={currentSnapshot.url}
                        alt={currentSnapshot.name}
                        className={clsx(
                            "transition-all duration-300 object-contain",
                            isRotated ? "w-[90vh] h-[90vw] rotate-90" : "w-full h-full max-h-screen p-2"
                        )}
                        style={{ clipPath: "inset(0 0 6% 0)" }} // Keep footer clipped even in fullscreen
                        onClick={(e) => e.stopPropagation()}
                    />

                    {/* Controls */}
                    <div className="absolute top-4 right-4 flex gap-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
                            className="bg-black/50 text-white p-2 rounded-full backdrop-blur-md hover:bg-white/20 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsRotated(!isRotated); }}
                            className="flex items-center gap-2 bg-black/60 text-white px-4 py-2 rounded-full backdrop-blur-md hover:bg-white/20 transition-colors border border-white/10"
                        >
                            <RotateCw className="w-4 h-4" />
                            <span className="text-sm font-medium">{isRotated ? "Portrait" : "Rotate"}</span>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
