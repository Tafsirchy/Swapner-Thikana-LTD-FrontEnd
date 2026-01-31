'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { Search, MapPin, Building, Users, Star } from 'lucide-react';
import FeatureShowcase from '@/components/home/FeatureShowcase';
import AboutSection from '@/components/home/AboutSection';
import InteractiveMasterPlan from '@/components/home/InteractiveMasterPlan';
import VirtualRealitySection from '@/components/home/VirtualRealitySection';
import NewsletterSection from '@/components/home/NewsletterSection';
import LiquidButton from '@/components/shared/LiquidButton';

// Creative Stat Item with Architectural Timeline Positioning
const StatItem = ({ stat, index }) => {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  React.useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = stat.value;
    if (start === end) return;
    let totalMilisecondDuraton = 2000;
    let incrementTime = (totalMilisecondDuraton / end) * 5;
    let timer = setInterval(() => {
      start += 5;
      setCount(Math.min(start, end));
      if (start >= end) clearInterval(timer);
    }, incrementTime);
    return () => clearInterval(timer);
  }, [stat.value, isInView]);

  const isEven = index % 2 === 0;

  return (
    <div className={`relative flex flex-col items-center flex-1 ${!isEven ? 'pt-24' : 'pb-24'}`}>
      {/* Connecting Stem (Vertical Line) */}
      <div className={`absolute left-1/2 -translate-x-1/2 w-px bg-brand-gold/30 h-24 ${
        isEven ? 'bottom-0' : 'top-0'
      }`}>
        {/* Decorative Anchor Dot */}
        <div className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full border border-brand-gold bg-royal-deep ${
           isEven ? 'bottom-0 translate-y-1/2' : 'top-0 -translate-y-1/2'
        }`}></div>
      </div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: isEven ? -20 : 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: index * 0.1 }}
        className="relative p-8 bg-white/[0.03] border border-white/10 group overflow-hidden w-full max-w-[240px] shadow-2xl"
      >
        {/* Glow Effect */}
        <div className="absolute -inset-24 bg-brand-gold/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-12 h-12 bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-6 transition-transform duration-700 group-hover:rotate-[360deg]">
            {React.cloneElement(stat.icon, { size: 24, strokeWidth: 1 })}
          </div>
          
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-4xl font-cinzel font-bold text-zinc-100 tracking-tighter">
               {count.toLocaleString()}
            </span>
            <span className="text-xl font-cinzel font-bold text-brand-gold">{stat.suffix}</span>
          </div>
          
          <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.4em] text-center leading-relaxed">
            {stat.label}
          </p>
          
          {/* Animated Border Reveal on Hover */}
          <div className="absolute inset-0 border border-brand-gold opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 pointer-events-none"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <motion.div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/luxury_home_hero.png')",
          }}
          initial={{ scale: 1 }}
          animate={{ scale: 1.1 }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            repeatType: "reverse", 
            ease: "linear" 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-royal-deep/80 via-royal-deep/40 to-royal-deep/90"></div>
        </motion.div>

        <div className="max-container px-4 pt-44 md:pt-32 relative z-10 text-center text-zinc-100">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-gold/20 border border-brand-gold/30 text-brand-gold text-xs font-semibold md:font-bold tracking-[0.2em] uppercase mb-5 backdrop-blur-sm">
              Premium Real Estate in Bangladesh
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-cinzel mb-6 tracking-tight">
              Discover Your <span className="text-brand-gold">Dream</span> Address
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
            className="max-w-4xl mx-auto bg-white/5 backdrop-blur-2xl p-2 rounded-none shadow-2xl"
          >
            <div className="flex flex-col md:flex-row items-center gap-2">
              <div className="flex-1 w-full flex items-center px-4 gap-3 bg-white/5 rounded-none border border-white/5 focus-within:border-brand-gold/30 transition-all">
                <Search size={20} className="text-brand-gold" />
                <input 
                  type="text" 
                  placeholder="Area, project or property type..."
                  className="w-full py-4 bg-transparent outline-none text-zinc-100 placeholder:text-zinc-500"
                />
              </div>
              <div className="flex-1 w-full flex items-center px-4 gap-3 bg-white/5 rounded-none border border-white/5">
                <MapPin size={20} className="text-brand-gold" />
                <select className="w-full py-4 bg-transparent outline-none text-zinc-100 appearance-none">
                  <option className="bg-royal-deep">All Locations</option>
                  <option className="bg-royal-deep">Gulshan</option>
                  <option className="bg-royal-deep">Banani</option>
                  <option className="bg-royal-deep">Dhanmondi</option>
                  <option className="bg-royal-deep">Uttara</option>
                </select>
              </div>
              <LiquidButton 
                className="w-full md:w-auto shadow-lg shadow-brand-gold/20"
              >
                Search
              </LiquidButton>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator - Moved down to avoid overlap */}
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-18 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 hover:opacity-100 transition-opacity z-20"
        >
          <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-medium">Explore</span>
          <div className="w-px h-10 bg-gradient-to-b from-brand-gold/60 to-transparent"></div>
        </motion.div>
      </section>

      {/* Stats Section - "The Legacy Gallery" */}
      <section className="py-32 bg-royal-deep relative overflow-hidden">
        {/* Architectural Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)`, backgroundSize: '40px 40px' }}></div>
        
        <div className="max-container px-4 relative">
          {/* Horizontal Axis Line (Desktop Only) */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-brand-gold/20 hidden lg:block -translate-y-1/2"></div>
          
          <div className="flex flex-col lg:flex-row items-stretch justify-between gap-12 lg:gap-0 relative z-10">
            {[
              { label: 'Properties Listed', value: 1250, suffix: '+', icon: <Building /> },
              { label: 'Happy Families', value: 800, suffix: '+', icon: <Users /> },
              { label: 'Success Rate', value: 99, suffix: '%', icon: <Star /> },
              { label: 'Experience', value: 15, suffix: ' Years', icon: <Building /> },
            ].map((stat, index) => (
              <StatItem key={stat.label} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase Section */}
      <FeatureShowcase />

      {/* About & Project Gallery Section */}
      <AboutSection />

      {/* Interactive Master Plan */}
      <InteractiveMasterPlan />

      {/* Virtual Reality Section */}
      <VirtualRealitySection />

      {/* Luxury Promo Section */}
      <section className="py-24 bg-gradient-to-r from-royal-deep via-zinc-900 to-royal-deep">
        <div className="max-container px-4 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 relative">
            <div className="absolute inset-0 border-2 border-brand-gold/20 -translate-x-4 translate-y-4"></div>
            <div className="relative z-10 w-full h-[500px]">
              <Image 
                src="https://images.unsplash.com/photo-1613545325278-f24b0cae1224?q=80&w=1920&auto=format&fit=crop" 
                alt="Luxury Interior" 
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex-1">
            <span className="text-brand-emerald font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Exclusive Membership</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold font-cinzel text-zinc-100 mb-6 leading-tight">
              Invest in the <span className="text-brand-gold font-cinzel">Future</span> of Dhaka
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

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
}
