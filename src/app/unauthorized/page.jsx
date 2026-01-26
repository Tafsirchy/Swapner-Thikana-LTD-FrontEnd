'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-royal-deep flex items-center justify-center px-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-brand-gold/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full relative z-10 glass p-10 rounded-[2.5rem] border-white/5 text-center"
      >
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 border border-red-500/20">
          <ShieldAlert size={40} />
        </div>
        
        <h1 className="text-3xl font-bold text-zinc-100 mb-2">Access Denied</h1>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          You do not have the required permissions to view this page. If you believe this is a mistake, please contact support.
        </p>

        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all active:scale-95 shadow-lg shadow-brand-gold/20"
        >
          <ArrowLeft size={18} />
          Return Home
        </Link>
      </motion.div>
    </div>
  );
};

export default UnauthorizedPage;
