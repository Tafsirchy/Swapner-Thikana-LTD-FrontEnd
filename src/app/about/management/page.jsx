'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Linkedin, Mail, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const ManagementPage = () => {
  const leaders = [
    {
      name: "Tafsir Chowdhury",
      role: "Founder & CEO",
      bio: "With over 15 years of experience in global real estate markets, Tafsir founded Shwapner Thikana to redefine luxury living in Bangladesh.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1200",
      linkedin: "#"
    },
    {
      name: "Nusrat Jahan",
      role: "Chief Operating Officer",
      bio: "An expert in operational excellence and strategic growth, Nusrat ensures our global standards are met across all branches.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200",
      linkedin: "#"
    },
    {
      name: "Arif Ahmed",
      role: "Head of Architecture",
      bio: "Arif leads our design vision, bridging the gap between traditional aesthetics and modern sustainable architecture.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1200",
      linkedin: "#"
    },
    {
      name: "Selina Rahman",
      role: "Director of Client Services",
      bio: "Ensuring an unparalleled concierge experience for our elite clientele, Selina manages our primary investor relations.",
      image: "https://images.unsplash.com/photo-1580894732230-28ec0527ac35?q=80&w=1200",
      linkedin: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-royal-deep pt-32 pb-24">
      <div className="max-container px-4">
        {/* Header */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mb-6"
          >
            <Users size={16} />
            Leadership
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold text-zinc-100 mb-8 tracking-tight">
            Our <span className="text-brand-gold italic">Management</span>
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-400 text-lg leading-relaxed">
            Meet the visionaries leading Shwapner Thikana towards a new era of architectural innovation and client trust.
          </p>
        </div>

        {/* Leaders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {leaders.map((leader, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 mb-6 group-hover:border-brand-gold/30 transition-all duration-500">
                <Image
                  src={leader.image}
                  alt={leader.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-royal-deep/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-6 left-6 right-6 flex justify-center gap-3 translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                   <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-gold hover:text-royal-deep transition-all">
                      <Linkedin size={18} />
                   </button>
                   <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-gold hover:text-royal-deep transition-all">
                      <Mail size={18} />
                   </button>
                </div>
              </div>
              <div className="text-center">
                 <h3 className="text-xl font-bold text-zinc-100 mb-1 group-hover:text-brand-gold transition-colors">{leader.name}</h3>
                 <span className="text-brand-gold/70 text-xs font-bold uppercase tracking-widest">{leader.role}</span>
                 <p className="mt-4 text-zinc-500 text-sm leading-relaxed px-4 line-clamp-3">
                    {leader.bio}
                 </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Join the Team CTA */}
        <div className="mt-40 bg-white/5 border border-white/10 rounded-[4rem] p-12 lg:p-20 flex flex-col items-center text-center">
           <h2 className="text-3xl font-bold text-white mb-6 italic">Want to join our vision?</h2>
           <p className="text-zinc-400 max-w-xl mb-10 leading-relaxed">
              We are always looking for passionate architects, real estate consultants, and creative minds to join our elite team.
           </p>
           <button className="px-10 py-5 bg-brand-gold text-royal-deep rounded-2xl font-bold hover:bg-brand-gold-light hover:scale-105 transition-all active:scale-95 flex items-center gap-2">
              View Careers <ArrowRight size={20} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default ManagementPage;
