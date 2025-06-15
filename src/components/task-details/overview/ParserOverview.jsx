import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LineChartComponent from '@/components/charts/LineChartComponent';
import BarChartComponent from '@/components/charts/BarChartComponent';

const ParserOverview = ({ task, renderProgressCards }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="glassmorphism-card">
        <CardHeader><CardTitle className="text-base text-slate-400 font-normal">CPU USAGE (%)</CardTitle></CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary mb-2">{task.graphs.cpuUsage[task.graphs.cpuUsage.length - 1].usage}%</p>
          <LineChartComponent data={task.graphs.cpuUsage} dataKey="usage" lineColor="hsl(var(--primary))" />
        </CardContent>
      </Card>
      <Card className="glassmorphism-card">
        <CardHeader><CardTitle className="text-base text-slate-400 font-normal">PROXY PERFORMANCE</CardTitle></CardHeader>
        <CardContent>
           <BarChartComponent data={task.graphs.proxyPerformance} />
        </CardContent>
      </Card>
    </div>
    <div className="mt-6">
        {renderProgressCards()}
    </div>
  </>
);

export default ParserOverview;