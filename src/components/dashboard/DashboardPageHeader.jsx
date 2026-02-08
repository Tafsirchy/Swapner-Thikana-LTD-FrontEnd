'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable header component for dashboard pages to ensure consistent hierarchy and aesthetics.
 * 
 * @param {Object} props
 * @param {string} props.title - The main page heading
 * @param {string} [props.subtitle] - Optional description or subtext
 * @param {React.ReactNode} [props.icon] - Optional icon component/element
 * @param {string} [props.iconColor] - Optional tailwind text color class for the icon (default: text-brand-gold)
 * @param {string} [props.iconBg] - Optional tailwind bg color class for icon container (default: bg-brand-gold/10)
 * @param {React.ReactNode} [props.actions] - Optional slot for action buttons (Export, Add, etc.)
 */
const DashboardPageHeader = ({ 
  title, 
  subtitle, 
  icon, 
  iconColor = "text-brand-gold",
  iconBg = "bg-brand-gold/10",
  actions,
  className = "" 
}) => {
  return (
    <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 ${className}`}>
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <h1 className="text-2xl sm:text-4xl font-bold text-zinc-100 flex items-center gap-3">
            {icon && (
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${iconBg} flex items-center justify-center shrink-0`}>
                {React.cloneElement(icon, { 
                  size: 24, 
                  className: `${iconColor} sm:size-[32px] transition-all` 
                })}
              </div>
            )}
            <span>{title}</span>
          </h1>
        </div>
        {subtitle && (
          <p className="text-zinc-500 mt-2 text-sm sm:text-lg max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {actions}
        </div>
      )}
    </div>
  );
};

export default DashboardPageHeader;
