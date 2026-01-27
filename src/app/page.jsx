'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Search, MapPin, Building, Users, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-10000 hover:scale-110"
          style={{ 
            backgroundImage: "url('/luxury_home_hero.png')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-royal-deep/80 via-royal-deep/40 to-royal-deep/90"></div>
        </div>

        <div className="max-container px-4 pt-20 relative z-10 text-center text-zinc-100">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-gold/20 border border-brand-gold/30 text-brand-gold text-xs font-semibold md:font-bold tracking-[0.2em] uppercase mb-5 backdrop-blur-sm">
              Premium Real Estate in Bangladesh
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              Discover Your <span className="text-brand-gold italic">Dream</span> Address
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
              Elevating the art of living. shwapner Thikana Ltd brings you the most exclusive 
              properties and innovative projects in Dhaka&apos;s premier neighborhoods.
            </p>
          </motion.div>

          {/* Quick Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto bg-white/5 backdrop-blur-2xl p-2 rounded-2xl shadow-2xl"
          >
            <div className="flex flex-col md:flex-row items-center gap-2">
              <div className="flex-1 w-full flex items-center px-4 gap-3 bg-white/5 rounded-xl border border-white/5 focus-within:border-brand-gold/30 transition-all">
                <Search size={20} className="text-brand-gold" />
                <input 
                  type="text" 
                  placeholder="Area, project or property type..."
                  className="w-full py-4 bg-transparent outline-none text-zinc-100 placeholder:text-zinc-500"
                />
              </div>
              <div className="flex-1 w-full flex items-center px-4 gap-3 bg-white/5 rounded-xl border border-white/5">
                <MapPin size={20} className="text-brand-gold" />
                <select className="w-full py-4 bg-transparent outline-none text-zinc-100 appearance-none">
                  <option className="bg-royal-deep">All Locations</option>
                  <option className="bg-royal-deep">Gulshan</option>
                  <option className="bg-royal-deep">Banani</option>
                  <option className="bg-royal-deep">Dhanmondi</option>
                  <option className="bg-royal-deep">Uttara</option>
                </select>
              </div>
              <button 
                className="w-full md:w-auto px-10 py-4 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all active:scale-95 shadow-lg shadow-brand-gold/20"
              >
                Search
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator - Moved down to avoid overlap */}
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 hover:opacity-100 transition-opacity"
        >
          <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-medium">Explore</span>
          <div className="w-px h-10 bg-gradient-to-b from-brand-gold/60 to-transparent"></div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-royal-deep relative">
        <div className="max-container px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { label: 'Properties Listed', value: '1,250+', icon: <Building /> },
              { label: 'Happy Families', value: '800+', icon: <Users /> },
              { label: 'Success Rate', value: '99%', icon: <Star /> },
              { label: 'Experience', value: '15 Years', icon: <Building /> },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-4 group-hover:scale-110 transition-transform duration-300">
                  {React.cloneElement(stat.icon, { size: 32 })}
                </div>
                <h3 className="text-3xl font-bold text-zinc-100 mb-2">{stat.value}</h3>
                <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Promo Section */}
      <section className="py-24 bg-gradient-to-r from-royal-deep via-zinc-900 to-royal-deep">
        <div className="max-container px-4 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 relative">
            <div className="absolute inset-0 border-2 border-brand-gold/20 -translate-x-4 translate-y-4 rounded-3xl"></div>
            <div className="relative z-10 w-full h-[500px]">
              <Image 
                src="https://images.unsplash.com/photo-1613545325278-f24b0cae1224?q=80&w=1920&auto=format&fit=crop" 
                alt="Luxury Interior" 
                fill
                className="rounded-3xl object-cover"
              />
            </div>
          </div>
          <div className="flex-1">
            <span className="text-brand-emerald font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Exclusive Membership</span>
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-6 leading-tight">
              Invest in the <span className="text-brand-gold italic">Future</span> of Dhaka
            </h2>
            <p className="text-zinc-400 mb-8 leading-relaxed text-lg italic font-serif">
              &quot;We don&apos;t just sell property; we curate lifestyles. Every project under our portfolio 
              is a testament to architectural brilliance and luxury.&quot;
            </p>
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-gold"></div>
                <span className="text-zinc-300 text-sm">Verified Premium Listings</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-gold"></div>
                <span className="text-zinc-300 text-sm">Legal & Financial Consultancy</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
