import React from 'react';

export const BorderQLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg" fill="none">
        <defs>
            <linearGradient id="us-blue-grad" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#3C3B6E" />
                <stop offset="100%" stopColor="#2A2A5A" />
            </linearGradient>
        </defs>

        {/* USA (The Core - Surrounded) */}
        <circle cx="60" cy="60" r="24" fill="url(#us-blue-grad)" />

        {/* Canada (Red Arc - Top/North) */}
        <path
            d="M 24 60 A 36 36 0 1 1 96 60"
            stroke="#D80027"
            strokeWidth="12"
            strokeLinecap="round"
        />

        {/* Mexico (Green Arc - Bottom/South + Q Tail) */}
        {/* Starts at right (0 deg), goes down to left (180 deg), includes tail extension */}
        <path
            d="M 96 60 A 36 36 0 0 1 24 60"
            stroke="#006847"
            strokeWidth="12"
            strokeLinecap="round"
        />

        {/* The Q Tail (Green extension) */}
        <path
            d="M 75 75 L 95 95"
            stroke="#006847"
            strokeWidth="12"
            strokeLinecap="round"
        />
    </svg>
);
