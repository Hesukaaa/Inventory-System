import React from "react";
import { ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#3b82f6", "#f97316", "#eab308", "#10b981", "#6366f1"];

const StatCard = React.memo(function StatCard({ title, value, sub, color, chartType }) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <div className="stat-icon" style={{ background: color }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {chartType === "box" && <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></>}
            {chartType === "chart-up" && <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></>}
            {chartType === "warning" && <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>}
            {chartType === "box-out" && <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></>}
            {chartType === "wrench" && <><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></>}
          </svg>
        </div>
        <div className="stat-info">
          <div className="stat-title">{title}</div>
          <div className="stat-value">{value.toLocaleString()}</div>
          <div className="stat-sub">{sub}</div>
        </div>
      </div>
      <div className="stat-chart">
        <ResponsiveContainer width="100%" height={50}>
          <LineChart data={[{ value: 40 }, { value: 55 }, { value: 45 }, { value: 70 }, { value: 60 }, { value: 75 }, { value: 65 }, { value: 80 }, { value: 70 }, { value: 85 }]}>
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

export default StatCard;
export { COLORS };
