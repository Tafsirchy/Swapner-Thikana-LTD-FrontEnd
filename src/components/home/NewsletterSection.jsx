'use client';

import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, Check } from 'lucide-react';
import Image from 'next/image';

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

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
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
    const generatedParticles = [...Array(15)].map((_, i) => ({
      delay: i * 0.5,
      duration: 6 + Math.random() * 6,
      size: 2 + Math.random() * 10,
      initialX: `${Math.random() * 100}%`,
      initialY: `${Math.random() * 100}%`
    }));
    setParticles(generatedParticles);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <section 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="py-16 md:py-24 relative overflow-hidden bg-black min-h-[600px] flex items-center"
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
                <Image 
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

        {/* STATIC Content Card - Increased Width & Refined Padding */}
        <div className="max-container px-4 relative z-10 w-full">
            <div className="w-full">
                <div 
                    className="bg-zinc-950/40 border border-white/10 backdrop-blur-3xl p-10 md:p-20 lg:p-24 text-center relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] rounded-none"
                >
                    {/* Interior Lighting - Dynamic & Brighter */}
                    <motion.div 
                        animate={isFocused ? { opacity: 0.25, scale: 1.2 } : { opacity: 0.1, scale: 1 }}
                        className="absolute inset-0 bg-brand-gold blur-[120px] -z-10"
                    />
                    
                    {/* Decorative Corner Accents */}
                    <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-brand-gold/30 rounded-none" />
                    <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-brand-gold/30 rounded-none" />
                    
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
                    <div className="absolute -right-40 -top-40 w-96 h-96 bg-brand-gold/5 blur-[100px] rounded-full" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* More Compact & Elegant Icon */}
                        <div className="relative w-20 h-20 mx-auto mb-8">
                             <div className="absolute inset-0 bg-brand-gold/30 rounded-3xl blur-2xl animate-pulse" />
                             <div className="relative w-full h-full bg-black/40 border border-white/20 rounded-3xl flex items-center justify-center text-brand-gold shadow-2xl">
                                <Mail size={36} strokeWidth={1.5} />
                             </div>
                        </div>

                        <span className="text-brand-gold font-bold tracking-[0.6em] uppercase text-xs mb-4 block">
                            The Portfolio Briefing
                        </span>
                        
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-cinzel text-white mb-8 leading-tight tracking-tight">
                            Elevate Your <span className="text-brand-gold italic">Vision</span>
                        </h2>
                        
                        <p className="text-zinc-400 text-lg md:text-xl mb-12 max-w-3xl mx-auto font-inter font-light leading-relaxed">
                            Subscribe to receive first-look access to <span className="text-white font-medium">unlisted estates</span>, architectural forecasts, and the defining trends of Dhaka&apos;s luxury skyline.
                        </p>

                        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-brand-gold/0 via-brand-gold/20 to-brand-gold/0 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative h-20">
                                <input 
                                    type="email" 
                                    placeholder="your@prestige.email" 
                                    value={email}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={status === 'loading' || status === 'success'}
                                    className="w-full h-full pl-10 pr-48 bg-black/60 border border-white/10 text-white text-lg placeholder:text-zinc-700 focus:outline-none focus:border-brand-gold/50 rounded-2xl transition-all shadow-inner"
                                />
                                
                                <button 
                                    type="submit"
                                    disabled={status === 'loading' || status === 'success'}
                                    className={`absolute right-2 top-2 bottom-2 px-10 rounded-xl font-bold text-sm tracking-[0.2em] uppercase transition-all duration-500 flex items-center justify-center gap-3 ${
                                        status === 'success' 
                                        ? 'bg-emerald-600 text-white' 
                                        : 'bg-brand-gold text-black hover:bg-white hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] active:scale-95 shadow-lg'
                                    }`}
                                >
                                    <AnimatePresence mode="wait">
                                        {status === 'loading' ? (
                                            <motion.div 
                                                key="loading"
                                                className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" 
                                            />
                                        ) : status === 'success' ? (
                                            <motion.div key="success" className="flex items-center gap-2">
                                                <Check size={20} />
                                                <span>Joined</span>
                                            </motion.div>
                                        ) : (
                                            <motion.div key="idle" className="flex items-center gap-2">
                                                <span>Request Access</span>
                                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </button>
                            </div>
                        </form>
                        
                        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
                             <div className="flex items-center gap-3 text-xs text-zinc-500 uppercase tracking-widest font-semibold">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/60 shadow-[0_0_10px_#f59e0b]" />
                                <span>Curated Weekly</span>
                             </div>
                             <div className="flex items-center gap-3 text-xs text-zinc-500 uppercase tracking-widest font-semibold">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 shadow-[0_0_10px_#10b981]" />
                                <span>VIP Invitations</span>
                             </div>
                             <div className="flex items-center gap-3 text-xs text-zinc-500 uppercase tracking-widest font-semibold">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-royal/60 shadow-[0_0_10px_#2563eb]" />
                                <span>Unsubscribe Anytime</span>
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
