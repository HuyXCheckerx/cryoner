import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

const SettingsContent = ({ task }) => (
  <div className="mt-6 space-y-6">
    <Card className="glassmorphism-card">
      <CardHeader><CardTitle className="text-lg text-slate-200">Task Configuration</CardTitle></CardHeader>
      <CardContent className="space-y-4 text-sm">
        {task.type === 'scraper' && (
          <>
            <div><span className="text-slate-400">Pages Parsed:</span> <span className="font-semibold text-slate-100">{task.settings.pages}</span></div>
            <div><span className="text-slate-400">Country:</span> <span className="font-semibold text-slate-100">{task.settings.country}</span></div>
            <div><span className="text-slate-400">Search Engine:</span> <span className="font-semibold text-slate-100">{task.settings.engine}</span></div>
            <div><span className="text-slate-400">Antipublic:</span> <span className={`font-semibold ${task.settings.antipublic ? 'text-green-400' : 'text-red-400'}`}>{task.settings.antipublic ? 'Enabled' : 'Disabled'}</span></div>
            <div><span className="text-slate-400">Keywords:</span> <span className={`font-semibold ${task.settings.keywords ? 'text-green-400' : 'text-red-400'}`}>{task.settings.keywords ? 'Active' : 'Inactive'}</span></div>
          </>
        )}
        {task.type === 'vulnerability' && (
          <div className="space-y-3">
            <p className="text-slate-300 font-medium">Scan Modules:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {task.settings.scanTypes.map(type => (
                <div key={type} className="bg-slate-800/60 p-3 rounded-md border border-slate-700/50">
                  <p className="text-slate-200 font-medium">{type}</p>
                  <p className="text-xs text-slate-400">Full Scan: <span className={task.settings.fullScan[type] ? "text-green-400" : "text-slate-500"}>{task.settings.fullScan[type] ? " Enabled" : " Disabled"}</span></p>
                </div>
              ))}
            </div>
          </div>
        )}
        {task.type === 'dorks-checker' && (
          <>
            <div><span className="text-slate-400">Source:</span> <span className="font-semibold text-slate-100">{task.settings.source}</span></div>
            <div><span className="text-slate-400">Filter Level:</span> <span className="font-semibold text-slate-100">{task.settings.filterLevel}</span></div>
          </>
        )}
        {task.type === 'dumper' && (
          <>
            <div><span className="text-slate-400">Target:</span> <span className="font-mono text-slate-100">{task.settings.target}</span></div>
            <div><span className="text-slate-400">Method:</span> <span className="font-semibold text-slate-100">{task.settings.method}</span></div>
          </>
        )}
        {task.type === 'dehasher' && (
          <>
            <div><span className="text-slate-400">Source:</span> <span className="font-semibold text-slate-100">{task.settings.source}</span></div>
            <div><span className="text-slate-400">Hash Type:</span> <span className="font-semibold text-slate-100">{task.settings.hashType}</span></div>
          </>
        )}
      </CardContent>
      <CardFooter className="border-t border-slate-800/50 pt-4">
        <Link to={`/builder/configure/${task.type}?taskId=${task.id}`}>
          <Button variant="outline" className="text-primary border-primary/70 hover:bg-primary/10">Edit Settings</Button>
        </Link>
      </CardFooter>
    </Card>
  </div>
);

export default SettingsContent;