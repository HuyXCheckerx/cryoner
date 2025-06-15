import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LineChartComponent from '@/components/charts/LineChartComponent';
import PieChartComponent from '@/components/charts/PieChartComponent';
import BarChartComponent from '@/components/charts/BarChartComponent';

const DehasherOverview = ({ task, renderProgressCards }) => {
  if (!task || !task.results || !task.graphs) {
    return <div className="text-slate-500">Loading dehasher data...</div>;
  }

  const dehashResultsData = [
    { name: 'Cracked', count: task.results.cracked || 0 },
    { name: 'Not Found', count: task.results.notFound || 0 }
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glassmorphism-card md:col-span-2">
          <CardHeader><CardTitle className="text-base text-slate-400 font-normal">CRACK SPEED (HASHES/MIN)</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary mb-2">{(task.results.crackSpeed || 0).toLocaleString()}</p>
            {task.graphs.crackSpeed && task.graphs.crackSpeed.length > 0 ? (
              <LineChartComponent data={task.graphs.crackSpeed} dataKey="speed" lineColor="hsl(var(--primary))" />
            ) : <p className="text-sm text-slate-500">No crack speed data available.</p>}
          </CardContent>
        </Card>
        <Card className="glassmorphism-card">
          <CardHeader><CardTitle className="text-base text-slate-400 font-normal">HASH TYPES CRACKED</CardTitle></CardHeader>
          <CardContent>
            {task.graphs.hashTypes && task.graphs.hashTypes.length > 0 ? (
              <PieChartComponent data={task.graphs.hashTypes} />
            ) : <p className="text-sm text-slate-500">No hash type data available.</p>}
          </CardContent>
        </Card>
        <Card className="glassmorphism-card">
          <CardHeader><CardTitle className="text-base text-slate-400 font-normal">PROXY BANDWIDTH (MBPS)</CardTitle></CardHeader>
          <CardContent>
            {task.graphs.proxyBandwidth && task.graphs.proxyBandwidth.length > 0 ? (
              <LineChartComponent data={task.graphs.proxyBandwidth} dataKey="mbps" lineColor="hsl(var(--accent))" />
            ) : <p className="text-sm text-slate-500">No proxy bandwidth data available.</p>}
          </CardContent>
        </Card>
         <Card className="glassmorphism-card md:col-span-2">
          <CardHeader><CardTitle className="text-base text-slate-400 font-normal">DEHASH RESULTS</CardTitle></CardHeader>
          <CardContent>
             <BarChartComponent data={dehashResultsData} />
          </CardContent>
        </Card>
      </div>
      <div className="mt-6">
          {renderProgressCards()}
      </div>
    </>
  );
};

export default DehasherOverview;