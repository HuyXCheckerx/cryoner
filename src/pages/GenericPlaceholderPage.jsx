import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import * as LucideIcons from 'lucide-react';

const GenericPlaceholderPage = ({ title, message, iconName = "Construction", variants, transition }) => {
  const IconComponent = LucideIcons[iconName] || LucideIcons.Construction;

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={variants}
      transition={transition}
      className="h-full flex flex-col items-center justify-center text-center p-6 md:p-8 bg-slate-950"
    >
      <IconComponent size={64} className="text-primary mb-6 opacity-70" />
      <h1 className="text-4xl font-bold text-slate-100 mb-3">{title}</h1>
      <p className="text-lg text-slate-400 mb-8 max-w-md">{message || "This section is currently under development. Check back soon for updates!"}</p>
      <Link to="/">
        <Button variant="outline" className="text-primary border-primary/70 hover:bg-primary/10">
          <LucideIcons.Home size={18} className="mr-2" /> Go to Homepage
        </Button>
      </Link>
      <p className="text-xs text-slate-600 mt-12 font-mono">LuxParser by Hostinger Horizons</p>
    </motion.div>
  );
};

export default GenericPlaceholderPage;