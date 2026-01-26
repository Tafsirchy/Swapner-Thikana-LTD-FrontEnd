'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Award, Star, ArrowRight, User } from 'lucide-react';
import { api } from '@/lib/api';
import Link from 'next/link';

const AgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const response = await api.user.getAgents();
        setAgents(response.data.agents || []);
      } catch (error) {
        console.error('Failed to fetch agents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-12">
      <div className="max-container px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-brand-gold font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
            Meet Our Team
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-6">
            Elite Real Estate <span className="text-brand-gold italic">Consultants</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Our experienced agents are dedicated to helping you find your perfect property. 
            With deep market knowledge and a commitment to excellence, we ensure a seamless experience.
          </p>
        </div>

        {/* Agents Grid */}
        {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[...Array(3)].map((_, i) => (
               <div key={i} className="h-[400px] bg-white/5 rounded-3xl animate-pulse border border-white/5"></div>
             ))}
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents.map((agent, index) => (
              <motion.div
                key={agent._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden hover:border-brand-gold/30 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent z-10"></div>
                  <img 
                    src={agent.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop'} 
                    alt={agent.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="bg-brand-gold text-royal-deep text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {agent.specialization || 'Real Estate Agent'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 pb-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-zinc-100 group-hover:text-brand-gold transition-colors">
                        {agent.name}
                      </h3>
                      <p className="text-zinc-500 text-sm">{agent.experience || 'Experienced'} in Field</p>
                    </div>
                    <div className="p-2 bg-white/5 rounded-full text-brand-gold border border-white/5">
                      <Star size={16} fill="currentColor" />
                    </div>
                  </div>

                  <p className="text-zinc-400 text-sm mb-6 line-clamp-2">
                    {agent.bio || 'Dedicated professional commitment to delivering exceptional service and results in the real estate market.'}
                  </p>

                  <div className="space-y-3 mb-6">
                    <a href={`mailto:${agent.email}`} className="flex items-center gap-3 text-sm text-zinc-400 hover:text-white transition-colors">
                      <Mail size={16} className="text-brand-gold" />
                      {agent.email}
                    </a>
                    <a href={`tel:${agent.phone}`} className="flex items-center gap-3 text-sm text-zinc-400 hover:text-white transition-colors">
                      <Phone size={16} className="text-brand-gold" />
                      {agent.phone}
                    </a>
                  </div>

                  <button className="w-full py-3 rounded-xl bg-white/5 border border-white/5 text-zinc-100 font-bold hover:bg-brand-gold hover:text-royal-deep hover:border-brand-gold transition-all flex items-center justify-center gap-2">
                    View Profile
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {!loading && agents.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
            <User size={48} className="text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-zinc-300">No Agents Found</h3>
            <p className="text-zinc-500 mt-2">Check back later for our team updates.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentsPage;
