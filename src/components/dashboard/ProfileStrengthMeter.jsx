'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const ProfileStrengthMeter = ({ strength }) => {
  if (!strength) return null;

  const { score, missingFields } = strength;

  return (
    <div className="bg-white/5 border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
        <CheckCircle2 size={100} className="text-brand-gold" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            Profile Strength
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              score === 100 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-brand-gold/10 text-brand-gold'
            }`}>
              {score}% Complete
            </span>
          </h3>
          <Link href="/dashboard/settings" className="text-brand-gold text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-1">
            Edit Profile <ArrowRight size={14} />
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/5 h-3 rounded-full mb-8 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full ${
              score === 100 ? 'bg-emerald-500' : 'bg-brand-gold'
            } shadow-[0_0_15px_rgba(212,175,55,0.3)]`}
          />
        </div>

        {/* Missing Fields List */}
        {missingFields.length > 0 ? (
          <div className="space-y-3">
            <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">To reach 100%:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {missingFields.map((field) => (
                <div key={field} className="flex items-center gap-2 text-zinc-400 text-sm">
                  <Circle size={14} className="text-zinc-600" />
                  <span className="capitalize">{field.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-emerald-500 bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
            <CheckCircle2 size={24} />
            <div>
              <p className="font-bold text-sm">Perfect Profile!</p>
              <p className="text-xs text-emerald-500/70">Your profile is fully optimized for clients.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileStrengthMeter;
