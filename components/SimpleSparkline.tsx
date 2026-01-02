
export function SimpleSparkline({ points }: { points: number[] }) {
    if (!points || points.length < 2) return null;

    const height = 40;
    const width = 100;
    const max = Math.max(...points, 1); // Avoid div/0
    const min = 0; // Always start from 0 for area chart feeling

    // Normalize points to chart coordinates
    // x: distributed evenly (0 to 100)
    // y: 0 is at bottom (height), max is at top (0)
    const normalizedPoints = points.map((p, i) => {
        const x = (i / (points.length - 1)) * width;
        const y = height - ((p - min) / (max - min)) * height;
        return { x, y };
    });

    // Build SVG Path
    // M x0 y0 L x1 y1 ...
    const linePath = `M ${normalizedPoints.map(p => `${p.x},${p.y}`).join(' L ')}`;

    // Build Area Path (Close the loop at bottom)
    const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                </linearGradient>
            </defs>
            {/* Area Fill */}
            <path d={areaPath} fill="url(#chartGradient)" />

            {/* Line Stroke */}
            <path d={linePath} fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />

            {/* End Point Dot */}
            <circle
                cx={normalizedPoints[normalizedPoints.length - 1].x}
                cy={normalizedPoints[normalizedPoints.length - 1].y}
                r="3"
                className="fill-indigo-600"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}
