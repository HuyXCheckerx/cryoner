import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Home, Settings, Wrench, Database, KeyRound, Server, Folder, History, ShieldQuestion, ScanLine } from 'lucide-react';

const SidebarItem = ({ icon, text, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));

  return (
    <li className="relative">
      <Link
        to={to}
        className={`
          flex items-center py-2.5 px-4 my-1 font-medium rounded-md cursor-pointer
          transition-colors group
          ${isActive ? 'bg-gradient-to-tr from-primary/30 to-slate-800 text-primary shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
        `}
      >
        {icon}
        <span className="ml-3 text-sm">{text}</span>
        {isActive && <motion.div className="absolute left-0 top-1 bottom-1 w-1 bg-primary rounded-r-full" layoutId="active-pill" />}
      </Link>
    </li>
  );
};

const Sidebar = ({ isSidebarOpen }) => {
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="open"
      animate={isSidebarOpen ? 'open' : 'closed'}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="w-60 bg-slate-900/70 backdrop-blur-lg border-r border-slate-800/50 p-4 flex flex-col fixed inset-y-0 left-0 z-40"
    >
      <div className="flex items-center gap-2 px-1 py-3 mb-5 border-b border-slate-800">
        <Bot size={28} className="text-primary" />
        <span className="text-xl font-bold text-slate-100">Cryoner Suite</span>
      </div>
      <ul className="flex-1">
        <SidebarItem icon={<Home size={20} />} text="Homepage" to="/" />
        <SidebarItem icon={<Wrench size={20} />} text="Builder" to="/builder" />
        <SidebarItem icon={<ScanLine size={20} />} text="Parser" to="/parser" />
        <SidebarItem icon={<Database size={20} />} text="Dumper" to="/dumper" />
        <SidebarItem icon={<KeyRound size={20} />} text="Dehasher" to="/dehasher" />
        <SidebarItem icon={<ShieldQuestion size={20} />} text="Antipublic" to="/antipublic" />
        <SidebarItem icon={<Server size={20} />} text="Machines" to="/machines" />
        <SidebarItem icon={<Folder size={20} />} text="Files" to="/files" />
        <SidebarItem icon={<History size={20} />} text="History" to="/history" />
      </ul>
      <div className="mt-auto">
        <SidebarItem icon={<Settings size={20} />} text="Settings" to="/settings" />
      </div>
    </motion.aside>
  );
};

export default Sidebar;