'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, MoveLeft, Map } from 'lucide-react';
import LiquidButton from '@/components/shared/LiquidButton';

export default function NotFound() {
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-royal-deep">
      {/* Background Architectural Patterns (Consistent with Home) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)`, backgroundSize: '40px 40px' }}></div>
      
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-brand-gold/5 blur-[120px] rounded-full"></div>

      <div className="max-container px-4 py-20 relative z-10">
        <div className="flex flex-col items-center text-center">
          
          {/* 404 Animated Number */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative mb-8"
          >
            <h1 className="text-[8rem] md:text-[12rem] font-bold font-cinzel leading-none select-none">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-brand-gold via-brand-gold-light to-brand-gold/40">
                404
              </span>
            </h1>
            
            {/* Decorative Floating Element */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-8 w-16 h-16 border border-brand-gold/20 flex items-center justify-center backdrop-blur-sm hidden md:flex"
            >
              <Map className="text-brand-gold/50" size={24} strokeWidth={1} />
            </motion.div>
          </motion.div>

          {/* Title & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-md"
          >
            <h2 className="text-2xl md:text-3xl font-bold font-cinzel mb-4 tracking-wide uppercase">
              The Path Is <span className="text-brand-gold">Unknown</span>
            </h2>
            <p className="text-zinc-400 font-light leading-relaxed mb-10">
              The blueprint you&apos;re looking for has either been moved or never existed. 
              Let us guide you back to your dream address.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link href="/" passHref>
              <LiquidButton className="px-10 py-4 flex items-center gap-2">
                <Home size={18} />
                Back to Sanctuary
              </LiquidButton>
            </Link>
            
            <Link 
              href="/properties" 
              className="px-8 py-4 border border-white/10 hover:border-brand-gold/30 text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 group"
            >
              <MoveLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Explore Listings
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Aesthetic Accents */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-royal-deep to-transparent z-20"></div>
    </div>
  );
}
