'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Globe, ExternalLink, Building2 } from 'lucide-react';
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
    <div className="min-h-screen bg-royal-deep pt-32 pb-24">
      <div className="max-container px-4">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-[0.2em] my-6"
          >
            <Globe size={16} />
            Our Network
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-zinc-100 mb-8 tracking-tight">
            Strategic <span className="text-brand-gold">Agencies</span>
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-400 text-lg leading-relaxed">
            Our network of boutique agencies spans the nation, providing local expertise with a global standard of service.
          </p>
        </div>

        {/* Agencies List */}
        {loading ? (
          <div className="space-y-12">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-[400px] bg-white/5 rounded-[3rem] animate-pulse border border-white/10"></div>
            ))}
          </div>
        ) : agencies.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 border-dashed">
            <Building2 size={48} className="mx-auto text-zinc-700 mb-4" />
            <h3 className="text-xl font-bold text-zinc-300">No Agencies Found</h3>
            <p className="text-zinc-500 mt-1">Our network information is currently being updated.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {agencies.map((agency, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} bg-white/5 border border-white/10 rounded-none overflow-hidden hover:border-brand-gold/20 transition-all duration-500`}
            >
              <div className="lg:w-1/2 relative min-h-[400px]">
                <Image
                  src={agency.logo || agency.image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200"}
                  alt={agency.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-8 left-8">
                  <span className="px-6 py-2 bg-royal-deep/80 backdrop-blur-md text-brand-gold font-bold rounded-full border border-brand-gold/30">
                    {agency.name}
                  </span>
                </div>
              </div>
              <div className="lg:w-1/2 p-12 lg:p-16 flex flex-col justify-center">
                <h3 className="text-3xl font-bold text-white mb-6 italic">{agency.contactInfo?.address || agency.location}</h3>
                <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
                  {agency.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 pb-10 border-b border-white/5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold shrink-0">
                       <MapPin size={20} />
                    </div>
                    <div>
                       <span className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Address</span>
                       <span className="text-zinc-300 text-sm font-medium">{agency.contactInfo?.address || agency.address}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold shrink-0">
                       <Phone size={20} />
                    </div>
                    <div>
                       <span className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Contact</span>
                       <span className="text-zinc-300 text-sm font-medium">{agency.contactInfo?.phone || agency.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold shrink-0">
                       <Mail size={20} />
                    </div>
                    <div>
                       <span className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Email</span>
                       <span className="text-zinc-300 text-sm font-medium">{agency.contactInfo?.email || agency.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                   <button className="flex-1 bg-brand-gold text-royal-deep py-4 rounded-2xl font-bold hover:bg-brand-gold-light transition-all flex items-center justify-center gap-2">
                       Contact Agency <ExternalLink size={18} />
                   </button>
                   <button className="px-6 border border-white/10 rounded-2xl text-zinc-400 hover:border-brand-gold hover:text-brand-gold transition-all">
                       View Map
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgenciesPage;
