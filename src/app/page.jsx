'use client';

import React from 'react';
import Image from 'next/image';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import SmartImage from '@/components/shared/SmartImage';
import { Search, MapPin, Building, Users, Star } from 'lucide-react';
import FeatureShowcase from '@/components/home/FeatureShowcase';
import AboutSection from '@/components/home/AboutSection';
import InteractiveMasterPlan from '@/components/home/InteractiveMasterPlan';
import VirtualRealitySection from '@/components/home/VirtualRealitySection';
import NewsletterSection from '@/components/home/NewsletterSection';
import InvestmentSection from '@/components/home/InvestmentSection';
import LiquidButton from '@/components/shared/LiquidButton';
import LuxurySelect from '@/components/shared/LuxurySelect';
import { useRouter } from 'next/navigation';

// Creative Stat Item with Architectural Timeline Positioning
const StatItem = ({ stat, index }) => {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  React.useEffect(() => {
    if (isInView) {
      const duration = 2000; // 2 seconds animation
      const steps = 60;
      const stepValue = stat.value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += stepValue;
        if (current >= stat.value) {
          setCount(stat.value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps); // ~33ms per step
      
      return () => clearInterval(timer);
    }
  }, [isInView, stat.value]);

  const isEven = index % 2 === 0;

  return (
    <div className={`relative flex flex-col items-center flex-1 w-full ${!isEven ? 'sm:pt-24' : 'sm:pb-24'}`}>
      {/* Connecting Stem (Vertical Line) */}
      <div className={`absolute left-1/2 -translate-x-1/2 w-px bg-brand-gold/30 h-24 hidden sm:block ${
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
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [location, setLocation] = React.useState('All Locations');

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (location !== 'All Locations') params.set('city', location);
    
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0"
          >
            <Image
              src="/luxury_home_hero.webp"
              alt="Luxury Home Hero"
              fill
              priority
              className="object-cover"
              sizes="100vw"
              quality={75}
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-royal-deep/80 via-royal-deep/40 to-royal-deep/90"></div>
        </div>

        <div className="max-container px-4 pt-32 md:pt-32 relative z-10 text-center text-zinc-100">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-gold/20 border border-brand-gold/30 text-brand-gold text-[10px] sm:text-xs font-semibold md:font-bold tracking-[0.2em] uppercase mb-5 backdrop-blur-sm">
              Premium Real Estate in Bangladesh
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-cinzel mb-6 tracking-tight leading-tight">
              Discover Your <span className="text-brand-gold">Dream</span> Address
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed font-light px-2">
              Elevating the art of living. shwapner Thikana Ltd brings you the most exclusive 
              properties and innovative projects in Dhaka&apos;s premier neighborhoods.
            </p>
          </motion.div>

          {/* Quick Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto bg-white/5 backdrop-blur-2xl p-2 rounded-none shadow-2xl relative z-50 mb-8 sm:mb-0"
          >
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-2">
              <div className="flex-1 w-full flex items-center px-4 gap-3 bg-white/5 rounded-none border border-white/5 focus-within:border-brand-gold/30 transition-all">
                <Search size={20} className="text-brand-gold" />
                <input 
                  type="text" 
                  placeholder="Area, project or property type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-4 bg-transparent outline-none text-zinc-100 placeholder:text-zinc-500 text-sm sm:text-base"
                />
              </div>
              <div className="flex-1 w-full bg-white/5 border border-white/5 rounded-none overflow-hidden sm:overflow-visible">
                <LuxurySelect 
                  value={location}
                  onChange={setLocation}
                  options={['All Locations', 'Dhaka', 'Chattogram', 'Sylhet']}
                  icon={<MapPin size={20} />}
                  className="!bg-transparent !border-none !py-4 text-sm sm:text-base md:border-none"
                />
              </div>
              <LiquidButton 
                type="submit"
                className="w-full md:w-auto shadow-lg shadow-brand-gold/20 py-4"
              >
                Search
              </LiquidButton>
            </form>
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
          
          <div className="flex flex-col lg:flex-row items-stretch justify-between gap-6 sm:gap-12 lg:gap-0 relative z-10">
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
      {/* Luxury Promo Section - Investment Highlight */}
      <InvestmentSection />

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
}
