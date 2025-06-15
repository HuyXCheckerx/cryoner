import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LineChartComponent from '@/components/charts/LineChartComponent';
import PieChartComponent from '@/components/charts/PieChartComponent';

const AntipublicOverview = ({ task, renderProgressCards }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="glassmorphism-card md:col-span-2">
        <CardHeader><CardTitle className="text-base text-slate-400 font-normal">CHECK SPEED (LINES/MIN)</CardTitle></CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary mb-2">{task.results.checkSpeed.toLocaleString()}</p>
          <LineChartComponent data={task.graphs.checkSpeed} dataKey="speed" lineColor="hsl(var(--primary))" />
        </CardContent>
      </Card>
      <Card className="glassmorphism-card">
        <CardHeader><CardTitle className="text-base text-slate-400 font-normal">PUBLICITY ANALYSIS</CardTitle></CardHeader>
        <CardContent>
          <PieChartComponent data={task.graphs.publicity} />
        </CardContent>
      </Card>
    </div>
    <div className="mt-6">
        {renderProgressCards()}
    </div>
  </>
);

export default AntipublicOverview;