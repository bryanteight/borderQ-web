import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
    width: 32,
    height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    fontSize: 24,
                    background: 'transparent',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                }}
            >
                {/* Recreating BorderQLogo SVG for Favicon context */}
                <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                    {/* Background Circle to ensure visibility on all tab colors */}
                    <circle cx="60" cy="60" r="55" fill="white" />

                    {/* USA (Blue Core) */}
                    <circle cx="60" cy="60" r="24" fill="#3C3B6E" />

                    {/* Canada (Red Arc) */}
                    <path
                        d="M 24 60 A 36 36 0 1 1 96 60"
                        stroke="#D80027"
                        strokeWidth="12"
                        strokeLinecap="round"
                        fill="none"
                    />

                    {/* Mexico (Green Arc) */}
                    <path
                        d="M 96 60 A 36 36 0 0 1 24 60"
                        stroke="#006847"
                        strokeWidth="12"
                        strokeLinecap="round"
                        fill="none"
                    />

                    {/* The Q Tail */}
                    <path
                        d="M 75 75 L 95 95"
                        stroke="#006847"
                        strokeWidth="12"
                        strokeLinecap="round"
                    />
                </svg>
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    );
}
