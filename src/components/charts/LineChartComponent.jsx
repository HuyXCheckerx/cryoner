import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';

const LineChartComponent = ({ data, dataKey, lineColor }) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={{ stroke: 'hsl(var(--border))' }} />
        <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={{ stroke: 'hsl(var(--border))' }} />
        <RechartsTooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            borderColor: 'hsl(var(--border))',
            borderRadius: 'var(--radius)',
            boxShadow: '0 10px 20px hsla(0,0%,0%,.2)',
          }}
          itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
          labelStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
        />
        <Line type="monotone" dataKey={dataKey} stroke={lineColor} strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: lineColor }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;