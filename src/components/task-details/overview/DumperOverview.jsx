import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LineChartComponent from '@/components/charts/LineChartComponent';
import BarChartComponent from '@/components/charts/BarChartComponent';
import PieChartComponent from '@/components/charts/PieChartComponent';

const DumperOverview = ({ task, renderProgressCards }) => {
  if (!task || !task.results || !task.graphs) {
    return <div className="text-slate-500">Loading dumper data...</div>;
  }
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glassmorphism-card">
          <CardHeader><CardTitle className="text-base text-slate-400 font-normal">DUMP SPEED (ROWS/S)</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary mb-2">{(task.results.dumpSpeed || 0).toLocaleString()}</p>
            {task.graphs.dumpSpeed && task.graphs.dumpSpeed.length > 0 ? (
              <LineChartComponent data={task.graphs.dumpSpeed} dataKey="speed" lineColor="hsl(var(--primary))" />
            ) : <p className="text-sm text-slate-500">No dump speed data available.</p>}
          </CardContent>
        </Card>
        <Card className="glassmorphism-card">
          <CardHeader><CardTitle className="text-base text-slate-400 font-normal">PROXY BANDWIDTH (MBPS)</CardTitle></CardHeader>
          <CardContent>
             {task.graphs.proxyBandwidth && task.graphs.proxyBandwidth.length > 0 ? (
               <LineChartComponent data={task.graphs.proxyBandwidth} dataKey="mbps" lineColor="hsl(var(--accent))" />
             ): <p className="text-sm text-slate-500">No proxy bandwidth data available.</p>}
          </CardContent>
        </Card>
         <Card className="glassmorphism-card">
          <CardHeader><CardTitle className="text-base text-slate-400 font-normal">DATA COMPOSITION</CardTitle></CardHeader>
          <CardContent>
            {task.graphs.dataComposition && task.graphs.dataComposition.length > 0 ? (
              <PieChartComponent data={task.graphs.dataComposition} />
            ) : <p className="text-sm text-slate-500">No data composition data available.</p>}
          </CardContent>
        </Card>
         <Card className="glassmorphism-card">
          <CardHeader><CardTitle className="text-base text-slate-400 font-normal">FOUND ITEMS</CardTitle></CardHeader>
          <CardContent>
            {task.graphs.foundItems && task.graphs.foundItems.length > 0 ? (
              <BarChartComponent data={task.graphs.foundItems} />
            ) : <p className="text-sm text-slate-500">No found items data available.</p>}
          </CardContent>
        </Card>
      </div>
      <div className="mt-6">
          {renderProgressCards()}
      </div>
    </>
  );
};

export default DumperOverview;