import React from 'react';
import { cn } from '@/lib/utils';

/**
 * A reusable Skeleton component for loading states.
 * 
 * @param {string} className - Additional classes for styling (width, height, rounded, etc.)
 * @param {boolean} shimmer - Whether to show the shimmer animation (default: true)
 */
const Skeleton = ({ className, shimmer = true, ...props }) => {
  return (
    <div
      className={cn(
        "bg-white/5 rounded-md",
        shimmer && "animate-pulse",
        className
      )}
      {...props}
    />
  );
};

export default Skeleton;
