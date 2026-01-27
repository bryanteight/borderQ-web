export function CameraIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                {/* 3D Body Gradient - Side depth */}
                <linearGradient id="bodyDepth" x1="0" y1="0" x2="0" y2="24" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#312E81" />
                    <stop offset="1" stopColor="#1E1B4B" />
                </linearGradient>

                {/* 3D Body Gradient - Top surface */}
                <linearGradient id="bodyFront" x1="12" y1="6" x2="12" y2="21" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#818CF8" /> {/* lighter indigo */}
                    <stop offset="1" stopColor="#4F46E5" /> {/* darker indigo */}
                </linearGradient>

                {/* Lens Gradient - Deep glass */}
                <radialGradient id="lensGlass" cx="12" cy="13" r="4" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#334155" />
                    <stop offset="0.7" stopColor="#0F172A" />
                    <stop offset="1" stopColor="#020617" />
                </radialGradient>

                {/* Metallic Ring Gradient */}
                <linearGradient id="ringGrad" x1="12" y1="8" x2="12" y2="18" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#F1F5F9" />
                    <stop offset="1" stopColor="#94A3B8" />
                </linearGradient>

                {/* Lens Highlight */}
                <linearGradient id="lensReflect" x1="10" y1="11" x2="14" y2="15" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="white" stopOpacity="0.4" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>

                {/* Shutter Button Gradient */}
                <linearGradient id="buttonGrad" x1="17.5" y1="5" x2="17.5" y2="9" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#FB7185" />
                    <stop offset="1" stopColor="#E11D48" />
                </linearGradient>

                {/* Glossy Overlay */}
                <linearGradient id="gloss" x1="12" y1="6" x2="12" y2="12" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="white" stopOpacity="0.2" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>

                <filter id="shadow" x="-2" y="-2" width="28" height="28" filterUnits="userSpaceOnUse">
                    <feDropShadow dx="0" dy="1" stdDeviation="0.5" floodColor="black" floodOpacity="0.3" />
                </filter>
            </defs>

            <g filter="url(#shadow)">
                {/* Body Depth */}
                <path
                    d="M3 10C3 8.34315 4.34315 7 6 7H18C19.6569 7 21 8.34315 21 10V18.5C21 20.1569 19.6569 21.5 18 21.5H6C4.34315 21.5 3 20.1569 3 18.5V10Z"
                    fill="url(#bodyDepth)"
                />

                {/* Viewfinder Bump Depth */}
                <path
                    d="M8.5 7L9.5 3.3H14.5L15.5 7"
                    fill="#312E81"
                />

                {/* Main Front Face */}
                <path
                    d="M3 9C3 7.34315 4.34315 6 6 6H18C19.6569 6 21 7.34315 21 9V17.5C21 19.1569 19.6569 20.5 18 20.5H6C4.34315 20.5 3 19.1569 3 17.5V9Z"
                    fill="url(#bodyFront)"
                />

                {/* Glossy highlight on body */}
                <path
                    d="M6 6H18C19.6569 6 21 7.34315 21 9V12H3V9C3 7.34315 4.34315 6 6 6Z"
                    fill="url(#gloss)"
                />

                {/* Viewfinder Bump Front */}
                <path
                    d="M9 6L10 3H14L15 6"
                    fill="#A5B4FC"
                />

                {/* Shutter Button */}
                <rect x="16.5" y="4.2" width="2.5" height="2.5" rx="1.25" fill="url(#buttonGrad)" />

                {/* Flash Window */}
                <rect x="5.5" y="8" width="4" height="2" rx="0.5" fill="#CBD5E1" />
                <rect x="5.5" y="8" width="1.5" height="2" rx="0.5" fill="white" fillOpacity="0.5" />

                {/* Lens Construction */}
                <circle cx="12" cy="13.5" r="5.2" fill="#1E1B4B" /> {/* Lens shadow */}
                <circle cx="12" cy="13" r="5" fill="url(#ringGrad)" />   {/* Metallic ring */}
                <circle cx="12" cy="13" r="4.2" fill="#0F172A" />   {/* Inner black ring */}
                <circle cx="12" cy="13" r="3.8" fill="url(#lensGlass)" /> {/* Glass */}

                {/* Lens Refraction/Reflection */}
                <circle cx="12" cy="13" r="3.8" fill="url(#lensReflect)" />

                {/* Shutter lens center */}
                <circle cx="12" cy="13" r="1.2" fill="#334155" />
                <circle cx="11.2" cy="12.2" r="0.4" fill="white" fillOpacity="0.8" />
            </g>
        </svg>
    );
}
