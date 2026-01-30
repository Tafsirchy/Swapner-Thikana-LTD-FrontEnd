'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

/**
 * LiquidButton - A premium button with a wavy liquid fill effect on hover.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button label or content
 * @param {Function} props.onClick - Click handler
 * @param {string} props.href - Optional URL for Link functionality
 * @param {string} props.className - Additional tailwind classes for sizing/positioning
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.baseColor - The base color of the button (default: brand-gold)
 * @param {string} props.liquidColor - The color of the liquid fill (default: brand-gold-light)
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
  rounded = "rounded-xl",
  justify = "justify-center",
  px = "px-10",
  py = "py-4"
}) => {
  const content = (
    <>
      {/* Liquid effect - SVG Wave */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        variants={{
          initial: { y: '100%' },
          hover: { y: '50%' }
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.svg
          className={`absolute bottom-full left-0 w-[200%] h-24 ${liquidColor} translate-y-px`}
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
          animate={{ x: ['-50%', '0%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <path d="M0 20 V10 Q25 0 50 10 T100 10 V20 H0 Z" />
        </motion.svg>
        <div className={`absolute inset-0 ${liquidColor.replace('fill-', 'bg-')} -bottom-1`} />
      </motion.div>

      {/* Button Content */}
      <span className={`relative z-10 flex items-center ${justify} gap-2 group-hover:text-white transition-colors duration-300`}>
        {children}
      </span>
      
      {/* Shine effect on hover */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
    </>
  );

  const commonProps = {
    whileHover: "hover",
    initial: "initial",
    className: `relative inline-flex items-center ${justify} ${px} ${py} font-bold ${rounded} overflow-hidden group transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 ${baseColor} text-royal-deep ${className}`
  };

  if (href) {
    return (
      <Link href={href}>
        <motion.span {...commonProps}>
          {content}
        </motion.span>
      </Link>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...commonProps}
    >
      {content}
    </motion.button>
  );
};

export default LiquidButton;
