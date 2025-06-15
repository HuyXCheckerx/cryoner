import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Activity, Database, ShieldAlert, Rows, MapPin, Eye, Settings2 } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { ComposableMap, Geographies, Geography, Marker, Annotation } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const mockDumpData = [
  { name: "USA", coordinates: [-98.5795, 39.8283], value: 1500 },
  { name: "Russia", coordinates: [90, 60], value: 800 },
  { name: "China", coordinates: [104.1954, 35.8617], value: 1200 },
  { name: "Brazil", coordinates: [-51.9253, -14.2350], value: 600 },
  { name: "India", coordinates: [78.9629, 20.5937], value: 950 },
  { name: "Germany", coordinates: [10.4515, 51.1657], value: 700 },
  { name: "Australia", coordinates: [133.7751, -25.2744], value: 450 },
];

const StatCard = ({ title, value, icon: Icon, color = "text-primary" }) => (
  <Card className="glassmorphism-card">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-slate-300">{title}</CardTitle>
      <Icon className={`h-5 w-5 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      <p className="text-xs text-slate-500 mt-1">Updated just now</p>
    </CardContent>
  </Card>
);

const mockRecentActivity = [
  { id: 'TSK006', module: 'Scraper Parser', status: 'Completed', timestamp: '2 mins ago' },
  { id: 'VUL003', module: 'Vulnerability Scan', status: 'Running', timestamp: '15 mins ago' },
  { id: 'DCK001', module: 'Dorks Checker', status: 'Failed', timestamp: '1 hour ago' },
];

const Homepage = ({ variants, transition, startNewTask }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={variants}
      transition={transition}
      className="h-full flex flex-col p-6 md:p-8 bg-slate-950 overflow-y-auto"
    >
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Welcome, User!</h1>
          <p className="text-sm text-slate-400">Here's your DorkPlus overview.</p>
        </div>
        <div className="flex space-x-2">
            <Button variant="outline" className="text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-slate-100">
                <Settings2 size={16} className="mr-2"/>
                Manage Days
            </Button>
            <Link to="/builder">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                    <PlusCircle size={18} className="mr-2"/> New Task
                </Button>
            </Link>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Scraped Links" value="1.2M" icon={Activity} />
        <StatCard title="Injectable Websites" value="3,450" icon={ShieldAlert} color="text-yellow-400" />
        <StatCard title="Databases Found" value="87" icon={Database} color="text-sky-400"/>
        <StatCard title="Dumped Rows" value="5.6M" icon={Rows} color="text-rose-500" />
      </div>

      <Card className="glassmorphism-card mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-100">Overview Center</CardTitle>
          <CardDescription className="text-slate-400">Find below all recent activity and important numbers.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-x-6 gap-y-8">
          <div>
            <h3 className="text-lg font-semibold text-slate-200 mb-3">Recent Activity</h3>
            <div className="space-y-3">
              {mockRecentActivity.map(activity => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-md hover:bg-slate-700/50 transition-colors">
                  <div>
                    <p className="font-semibold text-slate-200 text-sm">{activity.module} <span className="font-mono text-xs text-slate-500">({activity.id})</span></p>
                    <p className="text-xs text-slate-400">{activity.timestamp}</p>
                  </div>
                  <StatusBadge status={activity.status} />
                </div>
              ))}
            </div>
            <Link to="/history">
                <Button variant="link" className="text-primary mt-3 px-0 text-sm">View all activity</Button>
            </Link>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-200 mb-3">Dumps by Country</h3>
            <div className="h-64 md:h-80 bg-slate-800/30 rounded-md border border-slate-700/70 overflow-hidden relative">
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  scale: 90,
                  center: [0, 20]
                }}
                style={{ width: "100%", height: "100%" }}
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map(geo => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="hsl(var(--muted) / 0.4)"
                        stroke="hsl(var(--border) / 0.5)"
                        strokeWidth={0.3}
                        style={{
                            default: { outline: "none" },
                            hover: { fill: "hsl(var(--primary) / 0.3)", outline: "none" },
                            pressed: { fill: "hsl(var(--primary) / 0.5)", outline: "none" },
                        }}
                      />
                    ))
                  }
                </Geographies>
                {mockDumpData.map(({ name, coordinates, value }) => (
                  <Marker key={name} coordinates={coordinates}>
                    <motion.circle 
                        r={Math.max(2, Math.min(6, value / 200))} 
                        fill="hsla(var(--primary), 0.7)" 
                        stroke="hsl(var(--primary-foreground))" 
                        strokeWidth={0.5}
                        animate={{ 
                            scale: [1, 1.3, 1],
                            opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: Math.random() }}
                    />
                    <Annotation
                        subject={coordinates}
                        dx={-20}
                        dy={-10}
                        connectorProps={{
                            stroke: "hsl(var(--primary) / 0.5)",
                            strokeWidth: 0.5,
                            strokeLinecap: "round"
                        }}
                    >
                        <text x="-4" y="-3" textAnchor="end" alignmentBaseline="middle" style={{ fontFamily: "monospace", fontSize: "0.4rem", fill: "hsl(var(--primary-foreground))" }}>
                            {name} ({value})
                        </text>
                    </Annotation>
                  </Marker>
                ))}
              </ComposableMap>
               <div className="absolute bottom-2 right-2 bg-slate-900/70 p-1.5 rounded text-xs text-slate-400 backdrop-blur-sm">
                 Interactive map with dump data
               </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Example of how to trigger the bottom bar */}
      {/* <Button onClick={() => startNewTask("Test Background Task")}>Start Test Task</Button> */}
    </motion.div>
  );
};

export default Homepage;