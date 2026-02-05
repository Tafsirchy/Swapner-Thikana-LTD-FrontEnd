'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

/**
 * LuxurySelect - A premium custom select component.
 * 
 * @param {Object} props
 * @param {string} props.value - Current selected value
 * @param {Function} props.onChange - Value change handler
 * @param {Array} props.options - Array of options (strings or objects with {label, value})
 * @param {string} props.placeholder - Placeholder text
 * @param {React.ReactNode} props.icon - Optional icon to display on the left
 * @param {string} props.className - Additional classes for the trigger
 */
const LuxurySelect = ({ 
  value, 
  onChange, 
  options = [], 
  placeholder = "Select an option", 
  icon,
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    const val = typeof option === 'string' ? option : option.value;
    onChange(val);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => {
    const optVal = typeof opt === 'string' ? opt : opt.value;
    return optVal === value;
  });

  const displayLabel = selectedOption 
    ? (typeof selectedOption === 'string' ? selectedOption : selectedOption.label)
    : placeholder;

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-4 bg-white/5 border border-white/5 hover:border-brand-gold/30 transition-all text-zinc-100 focus:outline-none ${className}`}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-brand-gold">{icon}</span>}
          <span className={!value ? 'text-zinc-500' : ''}>{displayLabel}</span>
        </div>
        <ChevronDown 
          size={18} 
          className={`text-brand-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-[100] top-full left-0 w-full mt-2 bg-zinc-950 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-2xl"
          >
            <div className="max-h-50 overflow-y-auto custom-scrollbar">
              {options.map((option, index) => {
                const label = typeof option === 'string' ? option : option.label;
                const val = typeof option === 'string' ? option : option.value;
                const isSelected = val === value;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`w-full flex items-center justify-between px-5 py-2 text-left text-sm transition-colors hover:bg-white/5 ${
                      isSelected ? 'text-brand-gold bg-brand-gold/10' : 'text-zinc-400'
                    }`}
                  >
                    <span>{label}</span>
                    {isSelected && <Check size={14} className="text-brand-gold" />}
                  </button>
                );
              })}
            </div>
            {/* Decorative bottom line */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LuxurySelect;
