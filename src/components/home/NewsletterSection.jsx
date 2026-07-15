'use client';

import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, Check } from 'lucide-react';
import SmartImage from '@/components/shared/SmartImage';
import LiquidButton from '@/components/shared/LiquidButton';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

const FloatingParticle = ({ delay, duration, size, initialX, initialY, mouseX, mouseY }) => {
  // Parallax effect for particles based on their "depth"
  const offsetX = useTransform(mouseX, [-0.5, 0.5], [size * -10, size * 10]);
  const offsetY = useTransform(mouseY, [-0.5, 0.5], [size * -10, size * 10]);

  return (
    <motion.div
      style={{ x: offsetX, y: offsetY }}
      className="absolute pointer-events-none"
    >
      <motion.div
        initial={{ x: initialX, y: initialY, opacity: 0, scale: 0 }}
        animate={{ 
          y: [initialY, initialY - 150, initialY],
          opacity: [0, 0.4, 0],
          scale: [0.5, 1, 0.5],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: duration, 
          repeat: Infinity, 
          delay: delay,
          ease: "easeInOut" 
        }}
        className="bg-brand-gold/20 rounded-sm"
        style={{ width: size, height: size }}
      />
    </motion.div>
  );
};

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [isFocused, setIsFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);



  // Mouse tracking for background only
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const mouseXSpring = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const mouseYSpring = useSpring(mouseY, { stiffness: 100, damping: 30 });

  // Background 3D effects
  const bgRotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const bgRotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);
  const bgTranslateX = useTransform(mouseXSpring, [-0.5, 0.5], [-30, 30]);
  const bgTranslateY = useTransform(mouseYSpring, [-0.5, 0.5], [-30, 30]);

  // Optimize layout: Cache dimensions to avoid getBoundingClientRect on every move
  const rectRef = useRef(null);

  React.useEffect(() => {
    const updateRect = () => {
      if (containerRef.current) {
        rectRef.current = containerRef.current.getBoundingClientRect();
      }
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  }, []);

  const handleMouseMove = (e) => {
    if (!rectRef.current) return;
    
    // Use cached rect
    const rect = rectRef.current;
    
    // Calculate relative to the cached rect
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const [particles, setParticles] = useState([]);

  // Sync mount state and generate particles
  React.useEffect(() => {
    setMounted(true);
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const particleCount = isMobile ? 6 : 15;
    
    const generatedParticles = [...Array(particleCount)].map((_, i) => ({
      delay: i * (isMobile ? 1 : 0.5),
      duration: 6 + Math.random() * 6,
      size: 2 + Math.random() * (isMobile ? 6 : 10),
      initialX: `${Math.random() * 100}%`,
      initialY: `${Math.random() * 100}%`
    }));
    setParticles(generatedParticles);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const response = await api.newsletter.subscribe({ email });
      setStatus('success');
      setEmail('');
      toast.success(response.message || 'Subscribed! Check your inbox for confirmation.');
      setTimeout(() => setStatus('idle'), 4000);
    } catch (err) {
      setStatus('idle');
      const msg = err?.response?.data?.message || err?.response?.data?.error || 'Subscription failed. Please try again.';
      toast.error(msg);
    }
  };

  return (
    <section 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="py-16 md:py-24 relative overflow-hidden bg-black min-h-[450px] sm:min-h-[600px] flex items-center"
    >
        {/* Deep 3D Background Layer */}
        <motion.div 
            style={{ 
                rotateX: bgRotateX, 
                rotateY: bgRotateY, 
                x: bgTranslateX, 
                y: bgTranslateY,
                transformStyle: "preserve-3d",
                scale: 1.1
            }}
            className="absolute inset-0 z-0"
        >
             {/* Bright Background Image */}
             <div className="absolute inset-0 opacity-40 scale-110">
                <SmartImage 
                    src="https://images.unsplash.com/photo-1548623960-629433e1d65a?q=80&w=2000&auto=format&fit=crop" 
                    alt="Newsletter Background"
                    fill
                    className="object-cover"
                />
             </div>
             
             {/* Lighter Gradient Overlays */}
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
             <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/30" />

             {/* 3D Architectural Grid */}
             <div 
                style={{ transform: "translateZ(-100px)" }}
                className="absolute inset-0 opacity-20"
             >
                <div className="h-full w-full" style={{ 
                    backgroundImage: `linear-gradient(to right, #f59e0b 2px, transparent 2px), linear-gradient(to bottom, #f59e0b 2px, transparent 2px)`,
                    backgroundSize: '80px 80px' 
                }} />
             </div>

             {/* Parallax Particles */}
             <div className="absolute inset-0">
                {mounted && particles.map((p, i) => (
                    <FloatingParticle 
                        key={i} 
                        {...p} 
                        mouseX={mouseXSpring} 
                        mouseY={mouseYSpring} 
                    />
                ))}
             </div>
        </motion.div>

        {/* STATIC Content Card - Compact Version */}
        <div className="max-container px-4 relative z-10 w-full flex justify-center">
            <div className="w-full max-w-4xl">
                <div 
                    className="border border-white/10 p-6 sm:p-12 lg:p-16 text-center relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] bg-zinc-950/40 backdrop-blur-3xl"
                >
                    {/* Interior Lighting - Dynamic & Brighter */}
                    <motion.div 
                        animate={isFocused ? { opacity: 0.25, scale: 1.2 } : { opacity: 0.1, scale: 1 }}
                        className="absolute inset-0 bg-brand-gold blur-[120px] -z-10"
                    />
                    
                    {/* Decorative Corner Accents */}
                    <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-brand-gold/30" />
                    <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-brand-gold/30" />
                    
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* More Compact Icon */}
                             <div className="relative w-16 h-16 mx-auto mb-6">
                                  <div className="absolute inset-0 bg-brand-gold/30 rounded-none blur-xl animate-pulse" />
                                  <div className="relative w-full h-full bg-black/40 border border-white/20 rounded-none flex items-center justify-center text-brand-gold shadow-2xl">
                                     <Mail size={28} strokeWidth={1.5} />
                                  </div>
                             </div>

                        <span className="text-brand-gold font-bold tracking-[0.2em] sm:tracking-[0.5em] uppercase text-[10px] mb-3 block">
                            The Portfolio Briefing
                        </span>
                        
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-cinzel font-semibold text-white mb-6 leading-tight tracking-tight">
                            Elevate Your <span className="text-brand-gold">Vision</span>
                        </h2>
                        
                        <p className="text-zinc-400 text-base md:text-lg mb-10 max-w-2xl mx-auto font-inter font-light leading-relaxed">
                            Subscribe for first-look access to <span className="text-white font-medium">unlisted estates</span> and architectural forecasts.
                        </p>

                        <form onSubmit={handleSubmit} className="max-w-xl mx-auto relative group">
                            {/* Outer Glow */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-brand-gold/0 via-brand-gold/20 to-brand-gold/0 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-black/40 backdrop-blur-md border border-white/10 p-1.5 focus-within:border-brand-gold/50 transition-all shadow-inner gap-2 sm:gap-0">
                                <input 
                                    type="email" 
                                    placeholder="your@prestige.email" 
                                    value={email}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={status === 'loading' || status === 'success'}
                                    className="flex-1 w-full sm:w-auto bg-transparent pl-6 pr-4 h-[52px] sm:h-[56px] text-white text-base placeholder:text-zinc-600 focus:outline-none disabled:opacity-50"
                                />
                                
                                 <LiquidButton 
                                      type="submit"
                                      disabled={status === 'loading' || status === 'success'}
                                      baseColor={status === 'success' ? 'bg-emerald-600' : 'bg-brand-gold'}
                                      liquidColor={status === 'success' ? 'fill-white/10' : 'fill-brand-gold'}
                                      rounded="rounded-none"
                                      className="!px-6 !py-0 h-[52px] sm:h-[56px] shadow-lg shadow-brand-gold/20 w-full sm:w-auto flex-shrink-0"
                                  >
                                     <AnimatePresence mode="wait">
                                         {status === 'loading' ? (
                                             <motion.div 
                                                 key="loading"
                                                 className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" 
                                             />
                                         ) : status === 'success' ? (
                                             <motion.div key="success" className="flex items-center gap-2 text-white">
                                                 <Check size={18} />
                                                 <span className="text-[10px] font-bold tracking-wider uppercase">Member Joined</span>
                                             </motion.div>
                                         ) : (
                                             <motion.div key="idle" className="flex items-center gap-2 text-brand-gold group-hover:text-white transition-colors">
                                                 <span className="text-[10px] font-black tracking-[0.2em] uppercase">Request Access</span>
                                                 <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                             </motion.div>
                                         )}
                                     </AnimatePresence>
                                 </LiquidButton>
                            </div>
                        </form>
                        
                        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
                             <div className="flex items-center gap-3 text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">
                                <div className="w-1 h-1 rounded-full bg-brand-gold/60 shadow-[0_0_8px_#f59e0b]" />
                                <span>Curated Weekly</span>
                             </div>
                             <div className="flex items-center gap-3 text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">
                                <div className="w-1 h-1 rounded-full bg-emerald-500/60 shadow-[0_0_8px_#10b981]" />
                                <span>VIP Invitations</span>
                             </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default NewsletterSection;
