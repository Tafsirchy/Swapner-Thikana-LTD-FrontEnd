'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import MortgageCalculator from '@/components/tools/MortgageCalculator';

export default function MortgageCalculatorPage() {
  return (
    <div className="min-h-screen bg-royal-deep py-20 px-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <Link 
          href="/properties"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-brand-gold transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          Back to Properties
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 mb-6">
            <Calculator className="text-brand-gold" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-4">
            Mortgage Calculator
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Calculate your estimated monthly payments and see how different loan terms affect your budget
          </p>
        </motion.div>
      </div>

      {/* Calculator */}
      <MortgageCalculator />

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-6xl mx-auto mt-16"
      >
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass border-white/10 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center mb-4">
              <Home className="text-brand-gold" size={24} />
            </div>
            <h3 className="text-lg font-bold text-zinc-100 mb-2">How It Works</h3>
            <p className="text-sm text-zinc-400">
              Enter your property price, down payment, interest rate, and loan term to calculate your estimated monthly mortgage payment.
            </p>
          </div>

          <div className="glass border-white/10 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center mb-4">
              <Calculator className="text-brand-gold" size={24} />
            </div>
            <h3 className="text-lg font-bold text-zinc-100 mb-2">Accurate Estimates</h3>
            <p className="text-sm text-zinc-400">
              Our calculator uses the standard mortgage formula to provide accurate payment estimates based on your inputs.
            </p>
          </div>

          <div className="glass border-white/10 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center mb-4">
              <ArrowLeft className="text-brand-gold rotate-180" size={24} />
            </div>
            <h3 className="text-lg font-bold text-zinc-100 mb-2">Next Steps</h3>
            <p className="text-sm text-zinc-400">
              Ready to find your dream home? Browse our property listings and use this calculator to find the perfect fit for your budget.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
