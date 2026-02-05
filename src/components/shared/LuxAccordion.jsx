'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const LuxAccordion = ({ 
  title, 
  icon: Icon, 
  children, 
  defaultOpen = false,
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border-b border-white/10 ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between group transition-all"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          {Icon && (
            <div className={`p-2.5 rounded-xl transition-all duration-500 ${isOpen ? 'bg-brand-gold text-royal-deep' : 'bg-white/5 text-brand-gold'}`}>
              <Icon size={20} />
            </div>
          )}
          <span className={`text-lg font-bold tracking-tight transition-colors duration-300 ${isOpen ? 'text-zinc-100' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
            {title}
          </span>
        </div>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={isOpen ? 'text-brand-gold' : 'text-zinc-500'}
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="pb-8 text-zinc-400 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LuxAccordion;
