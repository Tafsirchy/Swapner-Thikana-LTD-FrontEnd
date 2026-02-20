'use client'; // Error boundaries must be client components

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RotateCw, Home, AlertTriangle } from 'lucide-react';
import LiquidButton from '@/components/shared/LiquidButton';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service if configured
    console.error('Global application error caught:', error);
  }, [error]);

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-royal-deep">
      {/* Background Architectural Patterns */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)`, backgroundSize: '40px 40px' }}></div>
      
      {/* Dynamic Background Glow - Red tinted for errors */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-red-500/5 blur-[120px] rounded-full"></div>

      <div className="max-container px-4 py-32 relative z-10">
        <div className="flex flex-col items-center text-center">
          
          {/* Animated Warning Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative mb-8"
          >
            <div className="w-24 h-24 rounded-full border border-red-500/20 bg-red-500/10 flex items-center justify-center backdrop-blur-md">
              <AlertTriangle className="text-red-400" size={40} strokeWidth={1.5} />
            </div>
            
            {/* Decorative Floating Element */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 border border-dashed border-red-500/20 rounded-full hidden md:block"
            />
          </motion.div>

          {/* Title & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-md"
          >
            <h2 className="text-2xl md:text-3xl font-bold font-cinzel mb-4 tracking-wide uppercase">
              Unexpected <span className="text-red-400">Interruption</span>
            </h2>
            <p className="text-zinc-400 font-light leading-relaxed mb-10">
              We encountered an unexpected issue while constructing this view. Our architects have been notified. Please try refreshing the foundation.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <LiquidButton 
              onClick={reset}
              baseColor="bg-brand-gold/10"
              liquidColor="fill-brand-gold/20"
              className="px-10 py-4 flex items-center justify-center gap-2 w-full sm:w-auto text-brand-gold border-brand-gold/30"
            >
              <RotateCw size={18} />
              Attempt Recovery
            </LiquidButton>
            
            <Link 
              href="/" 
              className="px-8 py-4 border border-white/10 hover:border-brand-gold/30 text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group w-full sm:w-auto"
            >
              <Home size={16} className="group-hover:scale-110 transition-transform" />
              Return Home
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Aesthetic Accents */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-royal-deep to-transparent z-20"></div>
    </div>
  );
}
