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
  const [openUpward, setOpenUpward] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
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

  // Recalculate position and detect upward flip
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const shouldFlip = spaceBelow < 280 && spaceAbove > spaceBelow;
      
      setOpenUpward(shouldFlip);
      setCoords({
        top: shouldFlip ? rect.top - 8 : rect.bottom + 8,
        left: rect.left,
        width: rect.width
      });

      // Close on scroll or resize to prevent floating issues
      const handleClose = () => setIsOpen(false);
      window.addEventListener('scroll', handleClose, true);
      window.addEventListener('resize', handleClose);
      
      return () => {
        window.removeEventListener('scroll', handleClose, true);
        window.removeEventListener('resize', handleClose);
      };
    }
  }, [isOpen]);

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
            initial={{ opacity: 0, y: openUpward ? 10 : -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: openUpward ? 10 : -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ 
              position: 'fixed',
              top: openUpward ? 'auto' : coords.top,
              bottom: openUpward ? (window.innerHeight - coords.top) : 'auto',
              left: coords.left,
              width: coords.width,
              zIndex: 9999
            }}
            className="bg-zinc-900/98 border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-3xl rounded-2xl"
            data-lenis-prevent
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {options.map((option, index) => {
                const label = typeof option === 'string' ? option : option.label;
                const val = typeof option === 'string' ? option : option.value;
                const isSelected = val === value;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`w-full flex items-center justify-between px-5 py-3 text-left text-sm transition-all hover:bg-white/10 ${
                      isSelected ? 'text-brand-gold bg-brand-gold/15 font-bold' : 'text-zinc-300'
                    }`}
                  >
                    <span>{label}</span>
                    {isSelected && <Check size={14} className="text-brand-gold" />}
                  </button>
                );
              })}
            </div>
            {/* Decorative bottom line */}
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LuxurySelect;
