'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, ArrowRight, User, Handshake } from 'lucide-react';
import { api } from '@/lib/api';
import SmartImage from '@/components/shared/SmartImage';
import AgentDetailsModal from '@/components/agents/AgentDetailsModal';

const AgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewProfile = (agent) => {
    setSelectedAgent(agent);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedAgent(null), 300); // Wait for exit animation
  };

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const response = await api.agents.getAll();
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
    <div className="min-h-screen bg-royal-deep pt-24 sm:pt-32 pb-12">
      <div className="max-container px-4">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] my-6"
          >
            <Handshake size={16} />
            Meet Our Team
          </motion.div>
          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-semibold text-zinc-100 mb-6 tracking-tight leading-tight">
            Elite Real Estate <span className="text-brand-gold">Consultants</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm sm:text-lg leading-relaxed px-2 sm:px-0">
            Our experienced agents are dedicated to helping you find your perfect property. 
            With deep market knowledge and a commitment to excellence, we ensure a seamless experience.
          </p>
        </div>

        {/* Agents Grid */}
        {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[...Array(3)].map((_, i) => (
               <div key={i} className="w-full aspect-[3/4] sm:aspect-[4/5] bg-zinc-900/50 rounded-none animate-pulse border border-white/5 relative overflow-hidden">
                 <div className="absolute bottom-6 left-6 right-6 space-y-3">
                   <div className="h-8 w-2/3 bg-white/10 rounded-lg"></div>
                   <div className="h-4 w-1/3 bg-brand-gold/20 rounded-lg"></div>
                 </div>
               </div>
             ))}
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents.map((agent, index) => (
              <motion.div
                key={agent._id}
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="group relative w-full aspect-[3/4] sm:aspect-[4/5] rounded-none overflow-hidden bg-zinc-950 border border-white/5 hover:border-brand-gold/30 hover:shadow-[0_20px_40px_-15px_rgba(212,175,55,0.1)] transition-all duration-700"
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <SmartImage 
                    src={agent.image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop'} 
                    alt={agent.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100 mix-blend-luminosity hover:mix-blend-normal"
                  />
                </div>

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-royal-deep via-royal-deep/80 to-transparent/10 opacity-100 transition-opacity duration-700 z-10 group-hover:via-royal-deep/60"></div>
                <div className="absolute inset-0 bg-brand-gold/5 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"></div>
                
                {/* Specialty Badge - Top Left */}
                <div className="absolute top-5 left-5 right-5 z-20 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                   <div className="bg-zinc-950/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 inline-flex items-center gap-2 shadow-2xl">
                     <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shadow-[0_0_10px_rgba(212,175,55,0.6)] animate-pulse shrink-0"></span>
                     <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-100 truncate">
                       {agent.specialty || 'Real Estate Expert'}
                     </span>
                   </div>
                </div>

                {/* Content - Bottom Aligned */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 flex flex-col justify-end z-20 h-full">
                  {/* Name and Basic Info */}
                  <div className="transform transition-transform duration-700 group-hover:-translate-y-2 mt-auto">
                    <h3 className="text-2xl sm:text-3xl font-cinzel font-bold text-white mb-0 tracking-tight group-hover:text-brand-gold transition-colors duration-500 leading-[1.1]">
                      {agent.name}
                    </h3>
                    <p className="text-brand-gold/80 text-[10px] sm:text-xs font-black tracking-widest uppercase">
                      {agent.experience || 'Premium'} Experience
                    </p>
                  </div>

                  {/* Hidden Details that reveal on Hover */}
                  <div className="overflow-hidden">
                    {/* The height animation trick */}
                    <div className="max-h-0 opacity-0 group-hover:max-h-[350px] group-hover:opacity-100 transition-all duration-700 ease-out transform translate-y-8 group-hover:translate-y-0">
                      
                      <div className="w-12 h-px bg-brand-gold/30 my-2"></div>

                      <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-3 font-serif italic selection:bg-brand-gold/30">
                        "{agent.bio || 'Dedicated professional committed to delivering exceptional service and results in the luxury real estate market.'}"
                      </p>

                      <div className="flex flex-col gap-2 mb-5">
                        <a href={`mailto:${agent.email}`} className="flex items-center gap-3 text-xs tracking-wider text-zinc-400 hover:text-white transition-colors group/link py-1 rounded-lg">
                          <div className="w-7 h-7 shrink-0 rounded-full border border-white/10 flex items-center justify-center group-hover/link:border-brand-gold group-hover/link:text-brand-gold transition-colors">
                            <Mail size={12} />
                          </div>
                          <span className="truncate">{agent.email}</span>
                        </a>
                        <a href={`tel:${agent.phone}`} className="flex items-center gap-3 text-xs tracking-wider text-zinc-400 hover:text-white transition-colors group/link py-1.5 rounded-lg">
                          <div className="w-7 h-7 shrink-0 rounded-full border border-white/10 flex items-center justify-center group-hover/link:border-brand-gold group-hover/link:text-brand-gold transition-colors">
                            <Phone size={12} />
                          </div>
                          <span className="truncate">{agent.phone}</span>
                        </a>
                      </div>
                      
                      <button 
                        onClick={() => handleViewProfile(agent)}
                        className="w-full h-12 rounded-xl bg-brand-gold/10 text-brand-gold border border-brand-gold/30 font-bold text-xs tracking-widest uppercase hover:bg-brand-gold hover:text-royal-deep transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-sm"
                      >
                        Explore Profile
                        <ArrowRight size={14} />
                      </button>

                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full border border-white/0 group-hover:border-white/10 rounded-none pointer-events-none transition-colors duration-500 z-30"></div>
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

      <AgentDetailsModal 
        agent={selectedAgent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default AgentsPage;
