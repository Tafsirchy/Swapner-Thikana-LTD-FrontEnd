'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, User, Crown, Cpu, Megaphone, Briefcase, Settings, Gem, Award, Mail, MessageCircle } from 'lucide-react';
import { api } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

const ManagementPage = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getRoleIcon = (role) => {
    const r = role?.toLowerCase() || '';
    if (r.includes('ceo') || r.includes('founder') || r.includes('chairman')) return <Crown size={24} />;
    if (r.includes('tech') || r.includes('cto') || r.includes('digital')) return <Cpu size={24} />;
    if (r.includes('market') || r.includes('brand') || r.includes('cmo')) return <Megaphone size={24} />;
    if (r.includes('finance') || r.includes('cfo')) return <Briefcase size={24} />;
    if (r.includes('ops') || r.includes('operations')) return <Settings size={24} />;
    return <Gem size={24} />;
  };

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

  return (
    <div className="min-h-screen bg-royal-deep pt-32 pb-24 overflow-x-hidden relative isolate [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-start justify-between mb-24 gap-12">
           <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-6 mb-8"
              >
                <span className="text-brand-gold font-cinzel text-xs tracking-[0.6em] uppercase font-black italic">The Masterminds</span>
                <div className="flex-1 h-px bg-gradient-to-r from-brand-gold/40 to-transparent"></div>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl md:text-5xl lg:text-6xl font-cinzel text-white leading-[0.85] tracking-tighter"
              >
                Our {" "}
                <span className="text-brand-gold relative inline-block">
                   Management
                   <motion.div 
                     initial={{ width: 0 }}
                     whileInView={{ width: '100%' }}
                     transition={{ delay: 0.8, duration: 1.5 }}
                     className="absolute -bottom-4 left-0 h-1 bg-brand-gold/20"
                   />
                </span>
              </motion.h1>
           </div>
           
           <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-sm"
           >
              <p className="text-zinc-500 text-lg leading-relaxed italic border-l-2 border-brand-gold/30 pl-8 mb-8">
                Leading the industry with a commitment to architectural excellence and unparalleled client trust.
              </p>
           </motion.div>
        </div>

        {/* Staggered Artistic Gallery - Grid Based */}
        <div className="mb-40">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
               {[...Array(3)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded-sm border border-white/10"></div>
               ))}
            </div>
          ) : leaders.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 border-dashed">
              <User size={48} className="mx-auto text-zinc-700 mb-4" />
              <h3 className="text-xl font-bold text-zinc-300">No Leaders Found</h3>
              <p className="text-zinc-500 mt-1">Management profiles are currently being updated.</p>
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
                      <div className="relative aspect-square overflow-hidden mb-6">
                        <Image 
                          src={leaders[1].image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200'} 
                          alt={leaders[1].name} 
                          fill 
                          className="object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" 
                        />
                        {/* Social Icons on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-royal-deep/80 via-royal-deep/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center gap-4 pb-8">
                           {leaders[1].email && (
                             <a href={`mailto:${leaders[1].email}`} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-gold hover:text-royal-deep transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                               <Mail size={18} />
                             </a>
                           )}
                           {leaders[1].whatsapp && (
                             <a href={`https://wa.me/${leaders[1].whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-green-500 hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 transition-transform delay-75">
                               <MessageCircle size={18} />
                             </a>
                           )}
                        </div>
                      </div>
                      <div className="flex flex-col items-center text-center">
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
                    <div className="relative group overflow-hidden bg-zinc-950 p-3 ring-1 ring-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] transition-all duration-500 hover:ring-brand-gold/30">
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <Image 
                          src={leaders[0].image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1200'} 
                          alt={leaders[0].name} 
                          fill 
                          className="object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-[2s] group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        
                        {/* Social Icons on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-royal-deep/80 via-royal-deep/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center gap-6 pb-8">
                           {leaders[0].email && (
                             <a href={`mailto:${leaders[0].email}`} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-gold hover:text-royal-deep transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                               <Mail size={22} />
                             </a>
                           )}
                           {leaders[0].whatsapp && (
                             <a href={`https://wa.me/${leaders[0].whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-green-500 hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 transition-transform delay-75">
                               <MessageCircle size={22} />
                             </a>
                           )}
                        </div>
                      </div>

                        <div className="mt-8 flex justify-between items-end pb-4 px-4">
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
                    <div className="relative group overflow-hidden bg-zinc-950 p-6 shadow-2xl border border-white/5 transition-all duration-500 hover:border-brand-gold/20">
                      <div className="relative aspect-[16/9] overflow-hidden rounded-sm">
                        <Image 
                          src={leaders[3].image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200'} 
                          alt={leaders[3].name} 
                          fill 
                          className="object-cover grayscale contrast-125 group-hover:grayscale-0 transition-transform duration-[2s] group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-1000"></div>
                        
                        {/* Social Icons on Hover */}
                        <div className="absolute inset-0 bg-royal-deep/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
                           {leaders[3].email && (
                             <a href={`mailto:${leaders[3].email}`} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-gold hover:text-royal-deep transition-all duration-300">
                               <Mail size={18} />
                             </a>
                           )}
                           {leaders[3].whatsapp && (
                             <a href={`https://wa.me/${leaders[3].whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-green-500 hover:text-white transition-all duration-300">
                               <MessageCircle size={18} />
                             </a>
                           )}
                        </div>
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
                      <div className="aspect-[3/4] overflow-hidden relative shadow-2xl ring-1 ring-white/10">
                        <Image 
                          src={leaders[2].image || 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200'} 
                          alt={leaders[2].name} 
                          fill 
                          className="object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-[1.2s] scale-110 group-hover:scale-100" 
                        />
                        <div className="absolute inset-0 bg-brand-gold/5 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-1000"></div>
                        
                        {/* Social Icons on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-royal-deep/80 via-royal-deep/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center gap-4 pb-8">
                           {leaders[2].email && (
                             <a href={`mailto:${leaders[2].email}`} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-gold hover:text-royal-deep transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                               <Mail size={18} />
                             </a>
                           )}
                           {leaders[2].whatsapp && (
                             <a href={`https://wa.me/${leaders[2].whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-green-500 hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 transition-transform delay-75">
                               <MessageCircle size={18} />
                             </a>
                           )}
                        </div>
                      </div>
                      <div className="absolute -left-8 bottom-8 p-6 bg-zinc-950 ring-1 ring-white/10 shadow-2xl backdrop-blur-xl flex gap-6 items-center transition-all duration-500 group-hover:ring-brand-gold/30">
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

        {/* Join the Team CTA */}
        <div className="mt-40 bg-zinc-950 border border-white/5 rounded-none p-12 lg:p-20 flex flex-col items-center text-center relative overflow-hidden group">
           <div className="absolute inset-0 bg-brand-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
           <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-white mb-6 italic relative z-10">Want to join our vision?</h2>
           <p className="text-zinc-500 max-w-xl mb-10 leading-relaxed italic relative z-10">
              We are always looking for passionate architects, real estate consultants, and creative minds to join our elite team.
           </p>
           <Link href="/contact" className="px-12 py-5 bg-brand-gold text-royal-deep font-black uppercase tracking-[0.2em] text-xs hover:bg-brand-gold-light hover:scale-105 transition-all active:scale-95 flex items-center gap-4 relative z-10">
              Inquire Today <ArrowRight size={16} />
           </Link>
        </div>
      </div>
    </div>
  );
};

export default ManagementPage;
