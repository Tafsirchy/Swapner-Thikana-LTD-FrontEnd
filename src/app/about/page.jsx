'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Users, Gem, ArrowRight, Crown, Cpu, Megaphone, Briefcase, Settings } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';

const AboutPage = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        setLoading(true);
        const response = await api.management.getAll();
        setLeaders(response.data.members || []);
      } catch (error) {
        console.error('Failed to fetch management:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  const getRoleIcon = (role) => {
    const r = role?.toLowerCase() || '';
    if (r.includes('ceo') || r.includes('founder') || r.includes('chairman')) return <Crown size={24} />;
    if (r.includes('tech') || r.includes('cto') || r.includes('digital')) return <Cpu size={24} />;
    if (r.includes('market') || r.includes('brand') || r.includes('cmo')) return <Megaphone size={24} />;
    if (r.includes('finance') || r.includes('cfo')) return <Briefcase size={24} />;
    if (r.includes('ops') || r.includes('operations')) return <Settings size={24} />;
    return <Gem size={24} />;
  };
  return (
    <div className="min-h-screen bg-royal-deep pt-32 pb-24 overflow-x-hidden">
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
                
                <Link href={`/philosophy/${pill.title.toLowerCase()}`} className="relative h-full block">
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
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experts in Excellence - Avant-Garde Editorial Redesign */}
      <section className="mb-32 py-24 relative isolate overflow-hidden">
        {/* Artistic Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-gold/5 rounded-full blur-[160px] -translate-y-1/2 translate-x-1/2 pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-emerald/5 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/2 pointer-events-none -z-10"></div>
        
        {/* Architectural Grid Lines */}
        <div className="absolute inset-0 flex justify-around pointer-events-none -z-10 px-4 opacity-[0.03]">
           <div className="w-px h-full bg-white"></div>
           <div className="w-px h-full bg-white hidden md:block"></div>
           <div className="w-px h-full bg-white hidden lg:block"></div>
           <div className="w-px h-full bg-white hidden xl:block"></div>
        </div>

        {/* Noise Overlay for Texture */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] -z-10"></div>

        <div className="max-container px-4">
          <div className="flex flex-col lg:flex-row items-start justify-between mb-24 gap-12">

             <div className="max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-6 mb-8"
                >
                  <span className="text-brand-gold font-cinzel text-xs tracking-[0.6em] uppercase font-black italic">The Masterminds</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-brand-gold/40 to-transparent"></div>
                </motion.div>
                
                <motion.h2 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-5xl lg:text-6xl font-cinzel text-white leading-[0.85] tracking-tighter"
                >
                  Experts in {" "}
                  <span className="text-brand-gold relative inline-block">
                    Excellence
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      transition={{ delay: 0.8, duration: 1.5 }}
                      className="absolute -bottom-4 left-0 h-1 bg-brand-gold/20"
                    />
                  </span>
                </motion.h2>
             </div>
             
             <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="max-w-sm"
             >
                <p className="text-zinc-500 text-lg leading-relaxed italic border-l-2 border-brand-gold/30 pl-8 mb-8">
                  Crafting architectural legacies through a fusion of heritage, innovation, and uncompromising precision.
                </p>
                <Link href="/contact" className="group inline-flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] text-white hover:text-brand-gold transition-all duration-500">
                   Discover the Vision <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </Link>
             </motion.div>
          </div>

          {/* Staggered Artistic Gallery - Grid Based */}
          <div className="">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                 {[...Array(3)].map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded-sm border border-white/10"></div>
                 ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-16 items-start">
                
                {/* Column 1 - Left Staggered */}
                <div className="space-y-16 lg:pt-32">
                  {/* Leader 2 - Elevated Offset */}
                  {leaders[1] && (
                    <motion.div
                      initial={{ opacity: 0, x: -60 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      viewport={{ once: true }}
                      className="w-full z-10"
                    >
                      <div className="relative group overflow-hidden bg-zinc-950/40 backdrop-blur-3xl p-4 ring-1 ring-white/5">
                        <div className="relative aspect-square overflow-hidden grayscale contrast-125 hover:grayscale-0 transition-all duration-1000">
                          <Image src={leaders[1].image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200'} alt={leaders[1].name} fill className="object-cover" />
                        </div>
                        <div className="mt-6 flex flex-col items-center text-center">
                            <div className="mb-4 p-2 rounded-full bg-brand-gold/5 border border-brand-gold/10 text-brand-gold/40 group-hover:text-brand-gold transition-colors duration-500">
                               {getRoleIcon(leaders[1].role)}
                            </div>
                            <h4 className="text-xl font-cinzel font-bold text-zinc-100 tracking-[0.2em] mb-2">{leaders[1].name}</h4>
                            <div className="w-8 h-px bg-brand-gold/40 mb-3"></div>
                            <p className="text-[9px] text-brand-gold uppercase tracking-[0.5em] font-black">{leaders[1].role}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* The "Liquid" Quote Card - Integrated into Col 1 */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    viewport={{ once: true }}
                    className="w-full z-40"
                  >
                    <div className="relative p-10 overflow-hidden group">
                      <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-3xl ring-1 ring-white/10 rounded-full scale-150 rotate-3 group-hover:rotate-0 transition-transform duration-[3s]"></div>
                      <div className="relative z-10 text-center space-y-4">
                         <Award className="text-brand-gold mx-auto mb-2 animate-pulse opacity-40" size={24} />
                         <p className="text-zinc-300 text-xs leading-relaxed italic font-medium font-serif">
                            &quot;Excellence is not an act, but a habit. We curate environments where perfection becomes the standard.&quot;
                         </p>
                         <div className="flex items-center justify-center gap-3 pt-2">
                            <div className="w-8 h-px bg-brand-gold/20"></div>
                            <span className="text-[7px] text-brand-gold/50 uppercase tracking-[0.6em] font-black italic whitespace-nowrap">The Gold Standard</span>
                            <div className="w-8 h-px bg-brand-gold/20"></div>
                         </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Column 2 - Middle (The Pillars) */}
                <div className="space-y-16 lg:-mt-12">
                  {/* Leader 1 - The Centerpiece */}
                  {leaders[0] && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 100 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                      viewport={{ once: true }}
                      className="w-full z-20"
                    >
                      <div className="relative group overflow-hidden bg-zinc-950 p-3 ring-1 ring-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
                        <div className="relative aspect-[4/5] overflow-hidden">
                          <Image src={leaders[0].image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1200'} alt={leaders[0].name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-[2s] group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        </div>

                          <div className="mt-8 flex justify-between items-end pb-4">
                          <div className="space-y-1">
                            <p className="text-brand-gold font-cinzel text-[10px] uppercase tracking-[0.3em] font-black italic mb-2">{leaders[0].role}</p>
                            <h3 className="text-4xl font-cinzel font-bold text-white tracking-widest leading-none">{leaders[0].name}</h3>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="text-brand-gold/30 group-hover:text-brand-gold/80 transition-colors duration-700">
                              {getRoleIcon(leaders[0].role)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Leader 4 - Bottom Cinematic Card */}
                  {leaders[3] && (
                    <motion.div
                      initial={{ opacity: 0, y: 60 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      viewport={{ once: true }}
                      className="w-full z-20"
                    >
                      <div className="relative group overflow-hidden bg-zinc-950 p-6 shadow-2xl border border-white/5">
                        <div className="relative aspect-[16/9] overflow-hidden rounded-sm">
                          <Image src={leaders[3].image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200'} alt={leaders[3].name} fill className="object-cover grayscale group-hover:grayscale-0 transition-transform duration-[2s] group-hover:scale-110" />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-1000"></div>
                        </div>
                        <div className="mt-8 flex items-center justify-between">
                          <div className="space-y-1">
                            <h4 className="text-2xl font-cinzel font-bold text-white tracking-widest">{leaders[3].name}</h4>
                            <p className="text-[10px] text-brand-gold font-black uppercase tracking-[0.4em] italic leading-none">{leaders[3].role}</p>
                          </div>
                          <div className="text-brand-gold/40 group-hover:text-brand-gold/80 transition-colors duration-700">
                            {getRoleIcon(leaders[3].role)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Column 3 - Right Staggered Deeply */}
                <div className="space-y-16 lg:pt-64">
                  {/* Leader 3 - Mid Asymmetrical Flank */}
                  {leaders[2] && (
                    <motion.div
                      initial={{ opacity: 0, x: 60 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      viewport={{ once: true }}
                      className="w-full z-30"
                    >
                      <div className="relative group">
                        <div className="aspect-[3/4] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-[1.2s] relative shadow-2xl ring-1 ring-white/10">
                          <Image src={leaders[2].image || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200'} alt={leaders[2].name} fill className="object-cover scale-110 group-hover:scale-100 transition-all duration-[1.2s]" />
                          <div className="absolute inset-0 bg-brand-gold/10 mix-blend-overlay"></div>
                        </div>
                        <div className="absolute -left-8 bottom-8 p-6 bg-zinc-950 ring-1 ring-white/10 shadow-2xl backdrop-blur-xl flex gap-6 items-center">
                        <div className="text-brand-gold/40 group-hover:text-brand-gold transition-colors duration-500">
                           {getRoleIcon(leaders[2].role)}
                        </div>
                        <div>
                          <h4 className="text-lg font-cinzel font-bold text-white tracking-widest">{leaders[2].name}</h4>
                          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-2 italic">{leaders[2].role}</p>
                        </div>
                      </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Decorative Accent for Col 3 */}
                  <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="hidden lg:block w-32 h-32 border border-brand-gold/20 rounded-full opacity-30 blur-sm mx-auto"
                  />
                </div>

              </div>
            )}
          </div>
        </div>
      </section>


    </div>
  );
};

export default AboutPage;
