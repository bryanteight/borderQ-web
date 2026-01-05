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

    // Smooth Curve Path using Cubic Bezier
    const getCurvePath = (points: { x: number, y: number }[]) => {
        if (points.length < 2) return "";
        let path = `M ${points[0].x},${points[0].y}`;

        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            // Use a simple control point logic for smooth curves
            const cp1x = p0.x + (p1.x - p0.x) / 3;
            const cp2x = p0.x + 2 * (p1.x - p0.x) / 3;
            path += ` C ${cp1x},${p0.y} ${cp2x},${p1.y} ${p1.x},${p1.y}`;
        }
        return path;
    };

    const linePath = getCurvePath(normalizedPoints);
    const areaPath = `${linePath} L ${normalizedPoints[normalizedPoints.length - 1].x},${padding.top + chartHeight} L ${padding.left},${padding.top + chartHeight} Z`;

    // Typical Line Path (Straight/Dashed)
    let typicalPath = null;
    if (!minimal && typicalPoints && typicalPoints.length === points.length) {
        const normTypical = typicalPoints.map((p, i) => normalize(p, i, typicalPoints.length));
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
                        <line x1={padding.left} y1={yPos} x2={svgWidth - padding.right} y2={yPos} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 2" />
                        <text x={padding.left - 4} y={yPos + 3} textAnchor="end" fontSize="9" fill="#94a3b8" className="select-none">{tick}m</text>
                    </g>
                );
            })}

            {/* Typical Line (Dashed) */}
            {!minimal && typicalPath && (
                <path d={typicalPath} fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
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

            {/* Points and Micro Labels */}
            {normalizedPoints.map((p, i) => (
                <g key={i}>
                    <circle
                        cx={p.x}
                        cy={p.y}
                        r={minimal ? 2.5 : 3}
                        style={{ fill: theme.fill }}
                        stroke="white"
                        strokeWidth={minimal ? 1 : 0}
                        vectorEffect="non-scaling-stroke"
                    />
                    {/* Minimal Labels for Key Points */}
                    {minimal && (i === 0 || i === 1 || i === normalizedPoints.length - 1) && (
                        <text
                            x={p.x}
                            y={svgHeight - 2}
                            textAnchor={i === 0 ? "start" : i === normalizedPoints.length - 1 ? "end" : "middle"}
                            fontSize="8"
                            fontWeight="900"
                            fill={theme.stroke}
                            className="select-none uppercase tracking-tighter opacity-40"
                        >
                            {labels ? labels[i] : (i === 0 ? "Now" : i === 1 ? "+1h" : "+3h")}
                        </text>
                    )}
                </g>
            ))}

            {/* X-Axis Labels (Standard Mode) */}
            {!minimal && labels && labels.map((label, i) => {
                const xPos = padding.left + (i / (labels.length - 1)) * chartWidth;
                return (
                    <text key={i} x={xPos} y={svgHeight} textAnchor="middle" fontSize="9" fill="#94a3b8" className="select-none uppercase">
                        {label}
                    </text>
                );
            })}
        </svg>
    );
}
