'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SmartImage from '@/components/shared/SmartImage';
import LiquidButton from '@/components/shared/LiquidButton';
import { CheckCircle2, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';

const InvestmentSection = () => {
  return (
    <section className="py-32 bg-royal-deep relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-emerald/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
      
      {/* Architectural Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ backgroundImage: `linear-gradient(#d4af37 1px, transparent 1px), linear-gradient(90deg, #d4af37 1px, transparent 1px)`, backgroundSize: '60px 60px' }}></div>

      <div className="max-container px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Visual Side */}
          <motion.div 
            className="flex-1 w-full relative group"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Main Image Frame */}
            <div className="relative z-20 overflow-hidden rounded-sm border border-white/10 shadow-2xl">
              <div className="relative aspect-[4/5] w-full">
                <SmartImage 
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1920&auto=format&fit=crop" 
                  alt="Luxury Modern Architecture" 
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-1000"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-royal-deep/80 via-transparent to-transparent"></div>
                
                {/* Floating Badge */}
                <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-brand-gold text-xs font-bold tracking-widest uppercase">Market Growth</span>
                    <TrendingUp size={16} className="text-brand-emerald" />
                  </div>
                  <div className="text-3xl font-cinzel font-bold text-white mb-1">+12.5%</div>
                  <p className="text-zinc-400 text-xs">Annual Property Value Appreciation</p>
                </div>
              </div>
            </div>

            {/* Decorative Offset Border */}
            <div className="absolute -inset-4 border border-brand-gold/30 z-10 rounded-sm translate-x-4 translate-y-4"></div>
          </motion.div>

          {/* Content Side */}
          <div className="flex-1 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-12 bg-brand-gold"></div>
                <span className="text-brand-gold font-bold tracking-[0.2em] uppercase text-xs">Secure Your Legacy</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-cinzel text-zinc-100 mb-8 leading-none">
                Invest in the <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-amber-200 to-brand-gold">
                  Future of Dhaka
                </span>
              </h2>

              <p className="text-zinc-400 text-lg leading-relaxed mb-10 font-light border-l-2 border-brand-gold/20 pl-6">
                &quot;We don&apos;t just build structures; we curate appreciating assets. Every project in our portfolio 
                is strategically located to ensure maximum ROI while delivering an unmatched lifestyle standard.&quot;
              </p>

              {/* Feature List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                {[
                  "Prime Locations Only",
                  "Verified Legal Status",
                  "High Rental Yields",
                  "Lifetime Asset Management"
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-royal-deep transition-colors duration-300">
                      <CheckCircle2 size={14} />
                    </div>
                    <span className="text-zinc-300 text-sm font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="flex gap-6 items-center">
                <LiquidButton className="px-8 py-4">
                  Download Investment Guide
                </LiquidButton>
                
                <button className="group flex items-center gap-2 text-zinc-400 hover:text-brand-gold transition-colors text-sm uppercase tracking-widest font-bold">
                  <span>View Portfolio</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default InvestmentSection;
