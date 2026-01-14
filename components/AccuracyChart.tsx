"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AccuracyChartProps {
    data: any[];
}

export default function AccuracyChart({ data }: AccuracyChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorMae" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                    dataKey="week"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    domain={[0, 'auto']}
                    dx={-10}
                />
                <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
                    labelStyle={{ color: '#94a3b8', marginBottom: '0.25rem', fontSize: '12px' }}
                    cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
                    formatter={(value: any) => [`${value} min`, "MAE"]}
                    labelFormatter={(label) => `Week ${label}`}
                />
                <Area
                    type="monotone"
                    dataKey="mae"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorMae)"
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
