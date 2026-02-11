'use client';

import React from 'react';
import Link from 'next/link';

/**
 * LiquidButton - A premium button with a solid fill effect on hover.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button label or content
 * @param {Function} props.onClick - Click handler
 * @param {string} props.href - Optional URL for Link functionality
 * @param {string} props.className - Additional tailwind classes for sizing/positioning
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.baseColor - The base color of the button (default: bg-brand-gold) - Converted to border/text color
 * @param {string} props.liquidColor - The color of the hover fill (default: fill-brand-gold) - Converted to bg color
 * @param {string} props.liquidBg - Explicit background color for hover fill (optional override)
 * @param {string} props.rounded - Border radius class (default: rounded-xl)
 * @param {string} props.justify - Flex justification (default: justify-center)
 * @param {string} props.px - Horizontal padding (default: px-10)
 * @param {string} props.py - Vertical padding (default: py-4)
 */
const LiquidButton = ({ 
  children, 
  onClick, 
  href,
  className = "", 
  type = "button", 
  disabled = false,
  baseColor = "bg-brand-gold",
  liquidColor = "fill-brand-gold",
  liquidBg,
  rounded = "rounded-xl",
  justify = "justify-center",
  px = "px-10",
  py = "py-4",
  ...props
}) => {
  // Derive colors from baseColor (e.g. "bg-brand-gold" -> text-brand-gold, border-brand-gold)
  const textColor = baseColor.includes('bg-') ? baseColor.replace('bg-', 'text-') : 'text-brand-gold';
  const borderColor = baseColor.includes('bg-') ? baseColor.replace('bg-', 'border-') : 'border-brand-gold';
  
  // Hover fill color: prefer liquidBg, else derive from liquidColor (fill->bg), else baseColor
  const hoverBg = liquidBg || (liquidColor && liquidColor.includes('fill-') ? liquidColor.replace('fill-', 'bg-') : baseColor);

  const containerClasses = `
    relative inline-flex items-center ${justify} ${px} ${py} 
    font-bold ${rounded} overflow-hidden group 
    bg-transparent border-2 ${borderColor} ${textColor}
    transition-all duration-500 ease-out
    active:scale-95 disabled:opacity-70 disabled:active:scale-100 disabled:cursor-not-allowed
    ${className}
  `.trim();

  // Content
  const content = (
    <>
      {/* Hover Fill Element - Fills from bottom */}
      <div 
        className={`absolute bottom-0 left-0 w-full h-0 group-hover:h-full transition-all duration-500 ease-out z-0 ${hoverBg}`} 
      />
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-500">
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={containerClasses} {...props}>
          {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={containerClasses}
      {...props}
    >
      {content}
    </button>
  );
};

export default LiquidButton;
