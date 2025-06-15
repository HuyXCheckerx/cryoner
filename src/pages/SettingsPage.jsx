import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Save, Settings as SettingsIcon, Wifi, WifiOff, Filter, FilterX, ShieldCheck, ShieldOff, Bot, Clock, FileDigit, KeySquare } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import useLocalStorage from '@/hooks/useLocalStorage';

const SettingsSection = ({ title, children }) => (
  <div className="mb-6 p-4 border border-slate-700/50 rounded-md bg-slate-800/30 shadow-md">
    <h2 className="text-lg font-semibold text-slate-200 mb-3 border-b border-slate-700 pb-2">{title}</h2>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const SettingItem = ({ label, children, icon: Icon, statusText, statusColor = "text-green-400" }) => (
  <div className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-b-0">
    <div className="flex items-center">
      {Icon && <Icon size={18} className="mr-3 text-slate-500" />}
      <Label className="text-sm text-slate-300">{label}</Label>
    </div>
    <div className="flex items-center space-x-2">
      {statusText && <span className={`text-xs font-medium ${statusColor}`}>{statusText}</span>}
      {children}
    </div>
  </div>
);

const initialSettings = {
  googleApi3: true,
  googleApi2: true,
  proxyless: true,
  filtering1: false,
  filtering2: true,
  bots: 800,
  timeout: 5,
  pages: 15,
  dorkCkees: true,
  checkDb: true,
  importBad: false,
};

const SettingsPage = ({ variants, transition }) => {
  const { toast } = useToast();
  const [settings, setSettings] = useLocalStorage('appSettings', initialSettings);
  const [tempSettings, setTempSettings] = useState(settings);

  useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  const handleSettingChange = (key, value) => {
    setTempSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveChanges = () => {
    setSettings(tempSettings);
    toast({
      title: "Settings Saved!",
      description: "Your configurations have been updated.",
    });
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={variants}
      transition={transition}
      className="h-full flex flex-col p-6 md:p-8 bg-slate-950 overflow-y-auto items-center"
    >
      <div className="w-full max-w-3xl">
        <header className="mb-8 text-center">
          <SettingsIcon size={48} className="mx-auto text-primary mb-3" />
          <h1 className="text-3xl font-bold text-slate-100">System Configuration</h1>
          <p className="text-sm text-slate-400">Fine-tune your Cryoner Enterprise Suite settings.</p>
        </header>

        <Card className="glassmorphism-card shadow-2xl shadow-black/30">
          <CardContent className="p-6">
            <SettingsSection title="API SETTINGS">
              <SettingItem label="Google API 3" icon={tempSettings.googleApi3 ? Wifi : WifiOff} statusText={tempSettings.googleApi3 ? "ON" : "OFF"} statusColor={tempSettings.googleApi3 ? "text-green-400" : "text-red-400"}>
                <Switch checked={tempSettings.googleApi3} onCheckedChange={(val) => handleSettingChange('googleApi3', val)} id="googleApi3" />
              </SettingItem>
              <SettingItem label="Google API 2" icon={tempSettings.googleApi2 ? Wifi : WifiOff} statusText={tempSettings.googleApi2 ? "ON" : "OFF"} statusColor={tempSettings.googleApi2 ? "text-green-400" : "text-red-400"}>
                <Switch checked={tempSettings.googleApi2} onCheckedChange={(val) => handleSettingChange('googleApi2', val)} id="googleApi2" />
              </SettingItem>
              <SettingItem label="Proxyless" icon={tempSettings.proxyless ? Wifi : WifiOff} statusText={tempSettings.proxyless ? "ON" : "OFF"} statusColor={tempSettings.proxyless ? "text-green-400" : "text-red-400"}>
                <Switch checked={tempSettings.proxyless} onCheckedChange={(val) => handleSettingChange('proxyless', val)} id="proxyless" />
              </SettingItem>
              <SettingItem label="Filtering (Primary)" icon={tempSettings.filtering1 ? Filter : FilterX} statusText={tempSettings.filtering1 ? "ON" : "OFF"} statusColor={tempSettings.filtering1 ? "text-green-400" : "text-red-400"}>
                <Switch checked={tempSettings.filtering1} onCheckedChange={(val) => handleSettingChange('filtering1', val)} id="filtering1" />
              </SettingItem>
              <SettingItem label="Filtering (Secondary)" icon={tempSettings.filtering2 ? Filter : FilterX} statusText={tempSettings.filtering2 ? "ON" : "OFF"} statusColor={tempSettings.filtering2 ? "text-green-400" : "text-red-400"}>
                <Switch checked={tempSettings.filtering2} onCheckedChange={(val) => handleSettingChange('filtering2', val)} id="filtering2" />
              </SettingItem>
            </SettingsSection>

            <SettingsSection title="PERFORMANCE CONFIG">
              <SettingItem label="Bots" icon={Bot}>
                <Input type="number" value={tempSettings.bots} onChange={e => handleSettingChange('bots', Number(e.target.value))} id="bots" className="w-24 h-8 bg-slate-800/70 border-slate-700 text-sm text-right" />
              </SettingItem>
              <SettingItem label="Timeout (s)" icon={Clock}>
                <Input type="number" value={tempSettings.timeout} onChange={e => handleSettingChange('timeout', Number(e.target.value))} id="timeout" className="w-24 h-8 bg-slate-800/70 border-slate-700 text-sm text-right" />
              </SettingItem>
              <SettingItem label="Pages" icon={FileDigit}>
                <Input type="number" value={tempSettings.pages} onChange={e => handleSettingChange('pages', Number(e.target.value))} id="pages" className="w-24 h-8 bg-slate-800/70 border-slate-700 text-sm text-right" />
              </SettingItem>
              <SettingItem label="DorkCKEES" icon={KeySquare} statusText={tempSettings.dorkCkees ? "ON" : "OFF"} statusColor={tempSettings.dorkCkees ? "text-green-400" : "text-red-400"}>
                <Switch checked={tempSettings.dorkCkees} onCheckedChange={(val) => handleSettingChange('dorkCkees', val)} id="dorkCkees" />
              </SettingItem>
            </SettingsSection>

            <SettingsSection title="SECURITY">
              <SettingItem label="CheckDB" icon={ShieldCheck} statusText={tempSettings.checkDb ? "ON" : "OFF"} statusColor={tempSettings.checkDb ? "text-green-400" : "text-red-400"}>
                <Switch checked={tempSettings.checkDb} onCheckedChange={(val) => handleSettingChange('checkDb', val)} id="checkDb" />
              </SettingItem>
              <SettingItem label="ImportBad" icon={ShieldOff} statusText={tempSettings.importBad ? "ON" : "OFF"} statusColor={tempSettings.importBad ? "text-green-400" : "text-red-400"}>
                <Switch checked={tempSettings.importBad} onCheckedChange={(val) => handleSettingChange('importBad', val)} id="importBad" />
              </SettingItem>
            </SettingsSection>

            <div className="mt-8 flex justify-end">
              <Button onClick={handleSaveChanges} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                <Save size={16} className="mr-2" /> Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default SettingsPage;