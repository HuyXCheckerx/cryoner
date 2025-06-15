import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LineChartComponent from '@/components/charts/LineChartComponent';

const ScraperOverview = ({ task, renderProgressCards }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="glassmorphism-card">
        <CardHeader><CardTitle className="text-base text-slate-400 font-normal">DORK / MINUTE</CardTitle></CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary mb-2">{task.dorkPerMinute.toLocaleString()}</p>
          <LineChartComponent data={task.graphs.dorkSpeed} dataKey="speed" lineColor="hsl(var(--primary))" />
        </CardContent>
      </Card>
      <Card className="glassmorphism-card">
        <CardHeader><CardTitle className="text-base text-slate-400 font-normal">FILTER / MINUTE</CardTitle></CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-sky-400 mb-2">{task.filterPerMinute.toLocaleString()}</p>
          <LineChartComponent data={task.graphs.filterSpeed} dataKey="speed" lineColor="hsl(var(--accent))" />
        </CardContent>
      </Card>
      <Card className="glassmorphism-card">
        <CardHeader><CardTitle className="text-base text-slate-400 font-normal">TOTAL LINKS</CardTitle></CardHeader>
        <CardContent className="space-y-3 pt-2">
          <div className="flex justify-between items-center"><span className="text-sm text-slate-300">Valid</span><span className="text-lg font-bold text-primary">{task.results.valid.toLocaleString()}</span></div>
          <div className="w-full h-1 bg-slate-700 rounded-full"><div className="h-1 bg-primary rounded-full" style={{ width: `${(task.results.valid / task.results.totalLinks) * 100}%` }}></div></div>
          <div className="flex justify-between items-center"><span className="text-sm text-slate-300">Filtered</span><span className="text-lg font-bold text-sky-400">{task.results.filtered.toLocaleString()}</span></div>
          <div className="w-full h-1 bg-slate-700 rounded-full"><div className="h-1 bg-sky-400 rounded-full" style={{ width: `${(task.results.filtered / task.results.totalLinks) * 100}%` }}></div></div>
          <p className="text-xs text-slate-500 pt-4 text-center">Total: {task.results.totalLinks.toLocaleString()} links processed.</p>
        </CardContent>
      </Card>
    </div>
    {renderProgressCards()}
  </>
);

export default ScraperOverview;