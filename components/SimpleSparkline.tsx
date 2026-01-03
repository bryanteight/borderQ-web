export function SimpleSparkline({
    points,
    typicalPoints,
    labels,
    minimal = false,
    color = "indigo"
}: {
    points: number[],
    typicalPoints?: number[],
    labels?: string[],
    minimal?: boolean,
    color?: "indigo" | "red" | "yellow" | "emerald" | "violet" | "amber"
}) {
    if (!points || points.length < 2) return null;

    // Color Maps
    const colors = {
        indigo: { stroke: "#4f46e5", fill: "#4f46e5", bg: "rgba(79, 70, 229, 0.2)" },
        red: { stroke: "#ef4444", fill: "#ef4444", bg: "rgba(239, 68, 68, 0.2)" },
        yellow: { stroke: "#eab308", fill: "#eab308", bg: "rgba(234, 179, 8, 0.2)" },
        emerald: { stroke: "#10b981", fill: "#10b981", bg: "rgba(16, 185, 129, 0.2)" },
        violet: { stroke: "#8b5cf6", fill: "#8b5cf6", bg: "rgba(139, 92, 246, 0.2)" },
        amber: { stroke: "#f59e0b", fill: "#f59e0b", bg: "rgba(245, 158, 11, 0.2)" },
    };
    const theme = colors[color] || colors.indigo;

    // Dimensions
    const svgHeight = minimal ? 40 : 80; // Increased height for axes
    const svgWidth = 200; // Abstract width
    const padding = minimal ? { top: 2, bottom: 2, left: 0, right: 0 } : { top: 10, bottom: 20, left: 25, right: 10 };
    const chartHeight = svgHeight - padding.top - padding.bottom;
    const chartWidth = svgWidth - padding.left - padding.right;

    // Scale Logic
    const allPoints = typicalPoints ? [...points, ...typicalPoints] : points;
    const maxVal = Math.max(...allPoints, 10); // Minimum scale of 10 min
    const minVal = 0;

    // Y Axis Ticks (0, 50%, 100%)
    const yTicks = [0, Math.round(maxVal / 2), Math.round(maxVal)];

    const normalize = (val: number, i: number, length: number) => ({
        x: padding.left + (i / (length - 1)) * chartWidth,
        y: padding.top + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight
    });

    const normalizedPoints = points.map((p, i) => normalize(p, i, points.length));

    // Main Line Path
    const linePath = `M ${normalizedPoints.map(p => `${p.x},${p.y}`).join(' L ')}`;
    const areaPath = `${linePath} L ${normalizedPoints[normalizedPoints.length - 1].x},${padding.top + chartHeight} L ${padding.left},${padding.top + chartHeight} Z`;

    // Typical Line Path (if exists & not minimal)
    let typicalPath = null;
    if (!minimal && typicalPoints && typicalPoints.length === points.length) {
        const normTypical = typicalPoints.map((p, i) => {
            let base = normalize(p, i, typicalPoints.length);
            // OVERLAP FIX: If typical point is very close to forecast point, nudge it up slightly
            // This ensures the dashed line is visible even if values are identical
            const forecastPoint = normalizedPoints[i];
            if (Math.abs(base.y - forecastPoint.y) < 2) {
                base.y -= 3; // Nudge up 3 pixels
            }
            return base;
        });
        typicalPath = `M ${normTypical.map(p => `${p.x},${p.y}`).join(' L ')}`;
    }

    return (
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible font-sans">
            <defs>
                <linearGradient id={`chartGradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={theme.fill} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={theme.fill} stopOpacity="0.0" />
                </linearGradient>
            </defs>

            {/* Grid Lines & Y-Axis Labels */}
            {!minimal && yTicks.map((tick, i) => {
                const yPos = padding.top + chartHeight - ((tick - minVal) / (maxVal - minVal)) * chartHeight;
                return (
                    <g key={i}>
                        {/* Grid Line */}
                        <line
                            x1={padding.left}
                            y1={yPos}
                            x2={svgWidth - padding.right}
                            y2={yPos}
                            stroke="#e2e8f0"
                            strokeWidth="1"
                            strokeDasharray="4 2"
                        />
                        {/* Y-Label */}
                        <text
                            x={padding.left - 4}
                            y={yPos + 3}
                            textAnchor="end"
                            fontSize="9"
                            fill="#94a3b8"
                            className="select-none"
                        >
                            {tick}m
                        </text>
                    </g>
                );
            })}

            {/* Typical Line (Dashed) */}
            {!minimal && typicalPath && (
                <path
                    d={typicalPath}
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                />
            )}

            {/* Forecast Area */}
            <path d={areaPath} fill={`url(#chartGradient-${color})`} />

            {/* Forecast Line */}
            <path
                d={linePath}
                fill="none"
                stroke={theme.stroke}
                strokeWidth={minimal ? 3 : 2}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
            />

            {/* Interactive Points (All) */}
            {!minimal && normalizedPoints.map((p, i) => (
                <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={i === normalizedPoints.length - 1 ? 3 : 2}
                    className={`hover:r-4 transition-all cursor-pointer`}
                    style={{ fill: theme.fill }}
                    stroke="transparent"
                    strokeWidth="4" // Increase hit area
                    vectorEffect="non-scaling-stroke"
                >
                    <title>{`${labels && labels[i] ? labels[i] : 'Forecast'}: ${points[i]} min`}</title>
                </circle>
            ))}

            {/* X-Axis Labels */}
            {!minimal && labels && labels.map((label, i) => {
                const xPos = padding.left + (i / (labels.length - 1)) * chartWidth;
                return (
                    <text
                        key={i}
                        x={xPos}
                        y={svgHeight}
                        textAnchor="middle"
                        fontSize="9"
                        fill="#94a3b8"
                        className="select-none uppercase"
                    >
                        {label}
                    </text>
                );
            })}
        </svg>
    );
}
