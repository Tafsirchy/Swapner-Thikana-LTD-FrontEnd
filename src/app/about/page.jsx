'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Users, Gem, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-royal-deep pt-32 pb-24">
      {/* Hero Section */}
      <section className="mb-32">
        <div className="max-container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-[0.2em]">
                Founded in 2011
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-zinc-100 tracking-tight leading-tight">
                Redefining the Art of <span className="text-brand-gold">Luxury Living</span>
              </h1>
              <p className="text-zinc-400 text-lg leading-relaxed italic">
                &quot;shwapner Thikana Ltd was established with a singular vision: to bring world-class architectural standards and uncompromising service to Bangladesh&apos;s premium real estate landscape.&quot;
              </p>
              <div className="flex items-center gap-12 pt-6">
                <div>
                  <span className="block text-4xl font-bold text-brand-gold mb-1">15+</span>
                  <span className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Years Exp.</span>
                </div>
                <div>
                  <span className="block text-4xl font-bold text-brand-gold mb-1">1,250+</span>
                  <span className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Listings</span>
                </div>
                <div>
                  <span className="block text-4xl font-bold text-brand-gold mb-1">800+</span>
                  <span className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Families</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] rounded-none overflow-hidden border border-white/10"
            >
              <Image 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
                alt="Our Office" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-royal-deep/80 to-transparent"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="mb-40 py-32 bg-white/[0.02] border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-brand-emerald/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-container px-4 text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-zinc-100 mb-6">Our Platinum <span className="text-brand-gold">Philosophy</span></h2>
          <p className="text-zinc-400 max-w-2xl mx-auto italic">Every brick we lay and every home we list is governed by four core pillars of excellence.</p>
        </div>

        <div className="max-container px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
            {[
              { icon: <Gem size={40} />, title: "Exclusivity", desc: "Curated selections that define the pinnacle of urban sophistication.", offset: "lg:-translate-y-8" },
              { icon: <ShieldCheck size={40} />, title: "Integrity", desc: "Transparent legal protocols ensuring your investment is secure and verified.", offset: "lg:translate-y-12" },
              { icon: <Award size={40} />, title: "Precision", desc: "Attention to detail from architectural blueprints to interior finishes.", offset: "lg:-translate-y-16" },
              { icon: <Users size={40} />, title: "Concierge", desc: "Bespoke service tailored to the unique lifestyle of elite investors.", offset: "lg:translate-y-4" }
            ].map((pill, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.21, 0.45, 0.32, 0.9] }}
                viewport={{ once: true }}
                className={`relative group ${pill.offset}`}
              >
                {/* Background Glow */}
                <div className="absolute -inset-4 bg-brand-gold/0 group-hover:bg-brand-gold/5 rounded-[3rem] blur-3xl transition-all duration-700 opacity-0 group-hover:opacity-100"></div>
                
                <div className="relative h-full p-10 bg-zinc-900/40 backdrop-blur-2xl border border-white/5 group-hover:border-brand-gold/40 transition-all duration-500 overflow-hidden">
                  {/* Decorative Number */}
                  <span className="absolute -right-4 -top-8 text-9xl font-cinzel font-black text-white/[0.02] group-hover:text-brand-gold/[0.05] transition-colors duration-700 pointer-events-none">
                    0{i + 1}
                  </span>

                  <div className="relative z-10 space-y-8">
                    {/* Icon Container with Floating Animation */}
                    <motion.div 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                      className="inline-flex p-4 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 text-brand-gold group-hover:scale-110 transition-transform duration-500"
                    >
                      {pill.icon}
                    </motion.div>

                    <div className="space-y-4">
                      <h3 className="text-3xl font-cinzel font-bold text-zinc-100 tracking-wider group-hover:text-brand-gold transition-colors duration-500">
                        {pill.title}
                      </h3>
                      <div className="w-12 h-0.5 bg-brand-gold/30 group-hover:w-full transition-all duration-700"></div>
                      <p className="text-zinc-400 text-sm leading-relaxed font-medium group-hover:text-zinc-200 transition-colors duration-500 italic">
                        {pill.desc}
                      </p>
                    </div>

                    {/* Bottom Accent */}
                    <div className="pt-8 flex justify-end">
                      <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-brand-gold/50 transition-colors duration-500">
                        <ArrowRight size={14} className="text-zinc-600 group-hover:text-brand-gold transition-colors" />
                      </div>
                    </div>
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-gold/0 group-hover:border-brand-gold/40 transition-all duration-500"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Intro / Culture */}
      <section className="mb-40">
        <div className="max-container px-4">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4 pt-12">
                     <div className="relative aspect-[4/5] rounded-none overflow-hidden border border-white/10">
                        <Image src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2024&auto=format&fit=crop" alt="" fill className="object-cover" />
                     </div>
                     <div className="relative aspect-square rounded-none overflow-hidden border border-white/10">
                        <Image src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070&auto=format&fit=crop" alt="" fill className="object-cover" />
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="relative aspect-square rounded-none overflow-hidden border border-white/10">
                        <Image src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop" alt="" fill className="object-cover" />
                     </div>
                     <div className="relative aspect-[4/5] rounded-none overflow-hidden border border-white/10">
                        <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" alt="" fill className="object-cover" />
                     </div>
                  </div>
               </div>
            </div>
            <div className="w-full lg:w-1/2 space-y-8 order-1 lg:order-2">
               <span className="text-brand-gold font-bold italic">The Concierge Team</span>
               <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-zinc-100">Experts in <span className="text-brand-gold">Excellence</span></h2>
               <p className="text-zinc-400 text-lg leading-relaxed">
                  Our team consists of industry veterans, legal specialists, and world-class interior consultants. We work in unison to provide a seamless transition from your vision to your reality.
               </p>
               <div className="space-y-4 pt-4">
                 {[
                   "Vetted Network of Global Architects",
                   "In-house Legal Compliance Squad",
                   "Premier Property Valuation Specialists",
                   "VIP Concierge Client Relations"
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-3">
                     <div className="w-6 h-6 rounded-full bg-brand-gold/10 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-gold"></div>
                     </div>
                     <span className="text-zinc-300 font-medium">{item}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
