import React from 'react';
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Bar } from 'recharts';

const BarChartComponent = ({ data, layout = 'horizontal' }) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <ComposedChart data={data} layout={layout} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
        <XAxis type={layout === 'vertical' ? 'number' : 'category'} dataKey={layout === 'vertical' ? undefined : 'name'} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
        <YAxis type={layout === 'vertical' ? 'category' : 'number'} dataKey={layout === 'vertical' ? 'name' : undefined} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} width={60} />
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
        <Bar dataKey="count" barSize={20} fill="hsl(var(--primary) / 0.7)" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;