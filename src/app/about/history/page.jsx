'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { History, Award, Users, Building, ShieldCheck } from 'lucide-react';

const HistoryPage = () => {
  const milestones = [
    {
      year: "2015",
      title: "The Foundation",
      description: "Shwapner Thikana was founded as a boutique real estate advisory team with a vision to bring transparency and excellence to Dhaka's luxury market.",
      icon: <Users className="text-brand-gold" size={24} />
    },
    {
      year: "2018",
      title: "Expansion to Chittagong",
      description: "Successful expansion into the port city, establishing our reputation as a pioneer in hills-side luxury developments.",
      icon: <Building className="text-brand-gold" size={24} />
    },
    {
      year: "2020",
      title: "Digital Transformation",
      description: "Launch of our first AI-driven property matching platform, revolutionizing how clients discover their dream homes.",
      icon: <ShieldCheck className="text-brand-gold" size={24} />
    },
    {
      year: "2022",
      title: "Excellence Awards",
      description: "Recognized as the 'Luxury Real Estate Agency of the Year' for our commitment to architectural integrity and client trust.",
      icon: <Award className="text-brand-gold" size={24} />
    },
    {
      year: "2024",
      title: "Global Reach",
      description: "Establishing partnerships with international architectural firms to bring global standards of living to Bangladesh.",
      icon: <History className="text-brand-gold" size={24} />
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
            <History size={16} />
            Our Journey
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold text-zinc-100 mb-8 tracking-tight">
            Our <span className="text-brand-gold italic">History</span>
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-400 text-lg leading-relaxed">
            A decade of architectural excellence, unwavering trust, and the pursuit of the perfect home.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-gold/0 via-brand-gold/50 to-brand-gold/0 hidden md:block"></div>

          {/* Milestones */}
          <div className="space-y-24">
            {milestones.map((milestone, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className={`flex flex-col md:flex-row items-center gap-12 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Year Side */}
                <div className="flex-1 text-center md:text-left">
                  <div className={`flex flex-col ${i % 2 === 0 ? 'md:items-start' : 'md:items-end'}`}>
                    <span className="text-7xl font-black text-white/5 group-hover:text-brand-gold/10 transition-colors duration-500 mb-2">
                       {milestone.year}
                    </span>
                    <h3 className="text-3xl font-bold text-brand-gold italic mb-4">{milestone.title}</h3>
                    <p className={`text-zinc-400 leading-relaxed max-w-md ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                      {milestone.description}
                    </p>
                  </div>
                </div>

                {/* Center Icon */}
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-royal-deep border border-brand-gold/30 flex items-center justify-center shadow-[0_0_20px_rgba(197,164,126,0.1)] shrink-0">
                   {milestone.icon}
                </div>

                {/* Empty Side for MD+ screens */}
                <div className="flex-1 hidden md:block"></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Future Vision */}
        <div className="mt-40 text-center glass p-20 rounded-[4rem] border-white/5 max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-zinc-100 mb-6 italic">The Future is Architectural</h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
               As we move forward, ہمارا focus remains on integrating sustainable technologies with timeless design, ensuring that every Shwapner Thikana project is a legacy for generations to come.
            </p>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
