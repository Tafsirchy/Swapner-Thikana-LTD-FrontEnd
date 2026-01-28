'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Download, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const MagazinesPage = () => {
  const magazines = [
    {
      title: "The Architecture Annual 2025",
      issue: "Issue #42",
      description: "A comprehensive look at the most iconic architectural debuts in Dhaka and beyond.",
      image: "https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?q=80&w=1200",
      category: "Architectural"
    },
    {
      title: "Luxe Living Monthly",
      issue: "Winter Edition",
      description: "Exploring the intersections of luxury, lifestyle, and high-end residential real estate.",
      image: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=1200",
      category: "Lifestyle"
    },
    {
      title: "Urban Development Report",
      issue: "Q4 2024",
      description: "Data-driven insights into the rapidly evolving urban landscape of Bangladesh.",
      image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1200",
      category: "Market Analysis"
    }
  ];

  return (
    <div className="min-h-screen bg-royal-deep pt-32 pb-24">
      <div className="max-container px-4">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mb-6"
          >
            <BookOpen size={16} />
            Publications
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold text-zinc-100 mb-8 tracking-tight">
            Our <span className="text-brand-gold italic">Magazines</span>
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-400 text-lg leading-relaxed">
            Dive into our curated collection of architectural journals, luxury lifestyle guides, and market analysis reports.
          </p>
        </div>

        {/* Magazines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {magazines.map((mag, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-brand-gold/20 transition-all duration-500"
            >
              <div className="relative h-[450px] overflow-hidden">
                <Image
                  src={mag.image}
                  alt={mag.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-royal-deep to-transparent opacity-60"></div>
                <div className="absolute bottom-8 left-8 right-8">
                  <span className="text-brand-gold text-[10px] font-bold uppercase tracking-widest mb-2 block">
                    {mag.category}
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2">{mag.title}</h3>
                  <p className="text-zinc-300 text-sm italic">{mag.issue}</p>
                </div>
              </div>
              <div className="p-8">
                <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                  {mag.description}
                </p>
                <div className="flex items-center justify-between">
                  <button className="flex items-center gap-2 text-brand-gold font-bold text-sm hover:underline">
                    <Download size={18} /> Download PDF
                  </button>
                  <Link href="#" className="p-3 rounded-full bg-white/5 text-zinc-400 hover:text-brand-gold transition-all">
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Subscription Section */}
        <div className="mt-32 p-12 lg:p-20 bg-brand-gold rounded-[4rem] text-royal-deep relative overflow-hidden text-center md:text-left">
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl">
                 <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">Get the latest issues delivered</h2>
                 <p className="text-royal-deep/80 text-lg font-medium">Subscribe to our physical distribution list for exclusive hard-cover architectural annuals.</p>
              </div>
              <button className="px-12 py-5 bg-royal-deep text-white font-extrabold rounded-2xl hover:scale-[1.02] transition-all shadow-2xl active:scale-95 whitespace-nowrap">
                 Request Monthly Subscription
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MagazinesPage;
