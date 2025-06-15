import React from 'react';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend } from 'recharts';

const PIE_COLORS = ['hsl(var(--primary))', 'hsl(var(--destructive))', 'hsl(var(--primary) / 0.6)', 'hsl(var(--primary) / 0.4)'];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent === 0) return null;

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const PieChartComponent = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={150}>
      <RechartsPieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={60}
          labelLine={false}
          label={renderCustomizedLabel}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} className="focus:outline-none stroke-slate-800" />
          ))}
        </Pie>
        <Legend iconSize={10} wrapperStyle={{ fontSize: "12px" }} />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;