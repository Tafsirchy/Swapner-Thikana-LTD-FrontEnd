'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Award, Users, Building, ShieldCheck, Loader2 } from 'lucide-react';
import api from '@/lib/api';

const iconMap = {
  Users: <Users className="text-brand-gold" size={24} />,
  Building: <Building className="text-brand-gold" size={24} />,
  ShieldCheck: <ShieldCheck className="text-brand-gold" size={24} />,
  Award: <Award className="text-brand-gold" size={24} />,
  History: <History className="text-brand-gold" size={24} />
};

const HistoryPage = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.history.getPublic();
        if (response.success) {
          setMilestones(response.data.milestones || []);
        }
      } catch (err) {
        console.error('Error fetching history:', err);
        setError('Failed to load our journey. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-royal-deep flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-royal-deep pt-32 pb-20">
      <div className="max-container px-4">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-[0.2em] my-6"
          >
            <History size={16} />
            Our Journey
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-zinc-100 mb-8 tracking-tight">
            Our <span className="text-brand-gold">History</span>
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-400 text-lg leading-relaxed">
            A decade of architectural excellence, unwavering trust, and the pursuit of the perfect home.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {error ? (
            <div className="text-center text-red-400 p-8 glass rounded-2xl border-red-500/20">
              {error}
            </div>
          ) : milestones.length === 0 ? (
            <div className="text-center text-zinc-400 p-8 glass rounded-2xl border-white/5">
              The story is just beginning...
            </div>
          ) : (
            <>
              {/* Vertical Line */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-gold/0 via-brand-gold/50 to-brand-gold/0 hidden md:block"></div>

              {/* Milestones */}
              <div className="space-y-24">
                {milestones.map((milestone, i) => (
                  <motion.div
                    key={milestone._id || i}
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
                       {iconMap[milestone.icon] || <History className="text-brand-gold" size={24} />}
                    </div>

                    {/* Empty Side for MD+ screens */}
                    <div className="flex-1 hidden md:block"></div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Future Vision */}
        <div className="mt-40 text-center glass p-20 rounded-[4rem] border-white/5 max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-zinc-100 mb-6 italic">The Future is Architectural</h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
               As we move forward, our focus remains on integrating sustainable technologies with timeless design, ensuring that every Shwapner Thikana project is a legacy for generations to come.
            </p>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
