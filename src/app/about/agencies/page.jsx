'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Globe, ExternalLink, Building2, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import Image from 'next/image';

const AgenciesPage = () => {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        setLoading(true);
        const response = await api.agencies.getAll();
        setAgencies(response.data.agencies || []);
      } catch (error) {
        console.error('Failed to fetch agencies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgencies();
  }, []);

  return (
    <div className="min-h-screen bg-royal-deep pt-32 pb-0 overflow-hidden">
      {/* Hero Header */}
      <div className="max-container px-4 mb-24 lg:mb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-6 py-2 bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] font-black uppercase tracking-[0.4em] mb-8"
        >
          <Globe size={14} /> Our Network
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-cinzel font-bold text-white mb-8 leading-none">
          Strategic <span className="text-brand-gold">Outposts</span>
        </h1>
        <p className="max-w-2xl text-zinc-400 text-lg leading-relaxed font-serif italic">
          Localized expertise with a global standard of excellence. Our boutique agencies are the cornerstones of our national presence.
        </p>
      </div>

      {/* Immersive Agencies List */}
      <div className="flex flex-col">
        {loading ? (
          <div className="max-container px-4 space-y-24 mb-24">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="aspect-[21/9] bg-white/5 animate-pulse border border-white/5"></div>
            ))}
          </div>
        ) : agencies.length === 0 ? (
          <div className="max-container px-4 py-32 text-center border-t border-white/5">
            <Building2 size={48} className="mx-auto text-zinc-800 mb-6" />
            <p className="text-zinc-500 uppercase tracking-widest font-bold">Network information currently unavailable</p>
          </div>
        ) : (
          agencies.map((agency, i) => (
            <motion.section
              key={agency._id || i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="relative min-h-screen flex items-center justify-center py-20 lg:py-0 border-b border-white/5 last:border-0"
            >
              {/* Background Immersive Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={agency.image || agency.logo || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000"}
                  alt={agency.name}
                  fill
                  className="object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-[2s] scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-royal-deep via-royal-deep/40 to-royal-deep"></div>
              </div>

              <div className="max-container px-4 relative z-10 w-full">
                <div className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 lg:gap-24`}>
                  
                  {/* Geographic Branding */}
                  <div className="flex-1 text-center lg:text-left">
                    <motion.div
                      initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      <span className="text-brand-gold font-black text-xs uppercase tracking-[0.5em] mb-4 block">
                        Network Station 0{i + 1}
                      </span>
                      <h2 className="text-4xl md:text-6xl font-cinzel font-bold text-white mb-6 uppercase leading-tight">
                        {agency.name.split(' ').map((word, idx) => (
                          <span key={idx} className={idx % 2 !== 0 ? 'text-brand-gold' : ''}>{word} </span>
                        ))}
                      </h2>
                      <div className="flex items-center justify-center lg:justify-start gap-4 text-zinc-500 font-serif italic text-2xl">
                         <MapPin size={24} className="text-brand-gold/50" />
                         <span>{agency.location || agency.contactInfo?.address?.split(',')[0]} Outpost</span>
                      </div>
                    </motion.div>
                  </div>

                  {/* High-Contrast Info Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="flex-1 bg-zinc-950/80 backdrop-blur-3xl border border-white/5 p-12 lg:p-16 relative overflow-hidden group shadow-2xl"
                  >
                    {/* Decorative Corner Brackets */}
                    <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-brand-gold/20 -translate-x-0 translate-y-0 transition-transform duration-700 group-hover:scale-110"></div>
                    
                    <p className="text-zinc-400 text-lg leading-relaxed mb-12 font-light opacity-80 group-hover:opacity-100 transition-opacity">
                      {agency.description || "Representing excellence in every transaction, our boutique office specializes in the curation of luxury living spaces and strategic investment consulting."}
                    </p>

                    <div className="space-y-6 mb-12">
                      <div className="flex items-center gap-6 group/item">
                        <div className="w-10 h-10 border border-brand-gold/20 flex items-center justify-center text-brand-gold group-hover/item:bg-brand-gold group-hover/item:text-royal-deep transition-all">
                          <Phone size={18} />
                        </div>
                        <span className="text-zinc-300 font-medium tracking-widest text-sm uppercase">{agency.contactInfo?.phone || agency.phone || "+880 2 5503 6666"}</span>
                      </div>
                      <div className="flex items-center gap-6 group/item">
                        <div className="w-10 h-10 border border-brand-gold/20 flex items-center justify-center text-brand-gold group-hover/item:bg-brand-gold group-hover/item:text-royal-deep transition-all">
                          <Mail size={18} />
                        </div>
                        <span className="text-zinc-300 font-medium tracking-widest text-sm uppercase lowercase">{agency.contactInfo?.email || agency.email || "info@shwapnerthikana.com"}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button className="flex-1 border-b border-brand-gold py-4 text-brand-gold font-black text-xs uppercase tracking-[0.4em] flex items-center justify-between group/btn hover:text-white transition-colors">
                        Connect with Station <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-2" />
                      </button>
                    </div>
                  </motion.div>

                </div>
              </div>

              {/* Decorative Side Label */}
              <div className={`absolute top-1/2 -translate-y-1/2 ${i % 2 === 0 ? 'right-12 rotate-90' : 'left-12 -rotate-90'} hidden xl:block`}>
                <span className="text-white/5 font-cinzel text-9xl font-black uppercase tracking-tighter select-none whitespace-nowrap">
                  ESTD 2011
                </span>
              </div>
            </motion.section>
          ))
        )}
      </div>
    </div>
  );
};

export default AgenciesPage;
