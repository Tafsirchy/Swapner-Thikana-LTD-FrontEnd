'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Download, ArrowRight, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';

const MagazinesPage = () => {
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        setLoading(true);
        const response = await api.magazines.getAll();
        setMagazines(response.data.magazines || []);
      } catch (error) {
        console.error('Error fetching magazines:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMagazines();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-royal-deep pt-32 pb-24 flex items-center justify-center">
        <Loader2 className="text-brand-gold animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-royal-deep pt-32 pb-24 relative overflow-hidden isolate">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-gold/5 rounded-full blur-[160px] -translate-y-1/2 translate-x-1/2 pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-brand-emerald/5 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/2 pointer-events-none -z-10"></div>
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] -z-10"></div>

      <div className="max-container px-4">
        {/* Header */}
        <div className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-brand-gold/5 border border-brand-gold/20 text-brand-gold text-xs font-black uppercase tracking-[0.4em] my-6"
          >
            <BookOpen size={14} className="animate-pulse" />
            The Archive
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-cinzel font-bold text-zinc-100 mb-8 tracking-tighter transition-all duration-700">
            Luxe <span className="text-brand-gold">Living</span>
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-500 text-lg leading-relaxed font-serif italic">
            A quarterly exploration into the heights of architectural innovation and the essence of refined urban existence.
          </p>
        </div>

        {/* Magazines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {magazines.length > 0 ? (
            magazines.map((mag, i) => (
              <motion.div
                key={mag._id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover="hover"
                transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                className="group relative perspective-1000"
              >
                {/* 3D Magazine Container - Lifts on Parent Hover */}
                <motion.div 
                  className="z-20 relative transition-transform duration-700"
                  variants={{
                    hover: { y: -99 }
                  }}
                >
                  <Link href={`/about/magazines/${mag.slug}`} className="block relative">
                    <div className="relative aspect-[3/4] preserve-3d group-hover:rotate-y-[-20deg] group-hover:translate-x-[-10%] transition-all duration-700 ease-[0.22,1,0.36,1]">
                      
                      {/* Shadow Layer */}
                      <div className="absolute inset-0 translate-z-[-50px] bg-black/40 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                      {/* Spine */}
                      <div className="absolute top-0 left-0 w-8 h-full bg-zinc-900 border-r border-white/10 origin-left rotate-y-90 -translate-x-full"></div>

                      {/* Back Cover / Inner Page Preview */}
                      <div className="absolute inset-0 bg-zinc-950 border border-white/5 shadow-2xl">
                          <div className="absolute inset-4 border border-brand-gold/10 flex items-center justify-center overflow-hidden italic text-brand-gold/5 text-[8px] font-serif leading-tight pointer-events-none text-center">
                             {mag.description}
                          </div>
                      </div>

                      {/* Front Cover */}
                      <div className="absolute inset-0 z-10 origin-left transition-transform duration-700 group-hover:rotate-y-[-10deg]">
                        <div className="relative h-full w-full overflow-hidden border border-white/5 shadow-2xl">
                          <Image
                            src={mag.coverImage || '/placeholder-magazine.jpg'}
                            alt={mag.title}
                            fill
                            className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-royal-deep/80 via-transparent to-black/20"></div>
                          
                          {/* Interactive Badge */}
                          <div className="absolute top-6 left-6 px-3 py-1 bg-brand-gold text-royal-deep text-[8px] font-black uppercase tracking-widest">
                            Collectors Edition
                          </div>

                          <div className="absolute bottom-8 left-8 right-8 text-white">
                            <span className="text-brand-gold text-[10px] font-black uppercase tracking-[0.4em] mb-4 block italic">
                              {mag.publisher || 'STLTD Media'}
                            </span>
                            <h3 className="text-3xl font-cinzel font-bold leading-tight mb-2 group-hover:text-brand-gold transition-colors duration-500">
                               {mag.title}
                            </h3>
                            <div className="w-12 h-0.5 bg-brand-gold mt-4 group-hover:w-full transition-all duration-700"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>

                {/* Info & CTA Overlay - Revealed as parent lifts */}
                <div className="absolute inset-x-0 bottom-0 z-10 transition-all duration-700 opacity-0 group-hover:opacity-100 flex flex-col justify-end h-full pointer-events-none group-hover:pointer-events-auto">
                   <div className="space-y-4 p-6 bg-zinc-950 border-t border-white/5 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                      <div className="flex items-center justify-between text-zinc-500 text-[9px] font-black uppercase tracking-[0.5em] mb-2 opacity-60">
                         <span>Issue {i + 1}</span>
                         <span className="italic">{mag.publicationDate ? new Date(mag.publicationDate).getFullYear() : '2024'} Edition</span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <a 
                          href={mag.pdfUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="group/btn flex items-center gap-3 text-brand-gold font-black text-[9px] uppercase tracking-[0.4em] hover:text-white transition-all duration-500"
                        >
                          <div className="w-8 h-8 rounded-full border border-brand-gold/30 flex items-center justify-center group-hover/btn:bg-brand-gold group-hover/btn:text-royal-deep transition-all duration-500">
                            <Download size={12} />
                          </div>
                          Access PDF
                        </a>
                        
                        <Link 
                          href={`/about/magazines/${mag.slug}`} 
                          className="group/explore flex items-center gap-3 text-zinc-100 font-black text-[9px] uppercase tracking-[0.4em] hover:text-brand-gold transition-all duration-500"
                        >
                           Explore <ArrowRight size={14} className="group-hover/explore:translate-x-2 transition-transform" />
                        </Link>
                      </div>
                   </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-40 border border-dashed border-white/5">
              <BookOpen size={48} className="mx-auto text-zinc-800 mb-6 opacity-20" />
              <p className="text-zinc-500 text-sm uppercase tracking-[0.5em] font-black">Archive currently empty</p>
            </div>
          )}
        </div>

        {/* Subscription Section - Luxury Redesign */}
        <div className="mt-48 relative isolate">
           <div className="absolute inset-0 bg-zinc-950 border border-white/5 -z-10"></div>
           <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1512418490979-92798ccc13b0?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-5 grayscale scale-110"></div>
           
           <div className="p-12 lg:p-24 flex flex-col lg:flex-row items-center justify-between gap-16 backdrop-blur-3xl">
              <div className="max-w-2xl">
                 <div className="w-20 h-px bg-brand-gold mb-8"></div>
                 <h2 className="text-5xl md:text-6xl font-cinzel font-bold text-white mb-8 leading-[0.85] tracking-tighter italic">Join the global <br/><span className="text-brand-gold">Subscription</span></h2>
                 <p className="text-zinc-500 text-lg font-serif italic pr-12 leading-relaxed">Secure your place on our physical distribution list for exclusive hard-cover architectural annuals and quarterly collector\&apos;s pieces.</p>
              </div>
              <div className="flex flex-col items-center gap-8 w-full lg:w-auto">
                 <button className="w-full lg:w-auto px-16 py-6 bg-brand-gold text-royal-deep font-black uppercase tracking-[0.3em] text-[10px] hover:bg-brand-gold-light hover:scale-105 transition-all shadow-[0_20px_40px_-15px_rgba(212,175,55,0.3)] active:scale-95 whitespace-nowrap">
                    Request Physical Copy
                 </button>
                 <span className="text-zinc-600 text-[9px] uppercase tracking-[0.6em] font-black">Limited to 500 members annually</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MagazinesPage;
