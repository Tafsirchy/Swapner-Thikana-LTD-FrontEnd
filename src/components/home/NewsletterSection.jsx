'use client';

import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, Check, Sparkles } from 'lucide-react';
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

        {/* STATIC Content Card - Reduced Padding */}
        <div className="max-container px-4 relative z-10 w-full">
            <div className="max-w-4xl mx-auto">
                <div 
                    className="bg-white/10 border border-white/20 backdrop-blur-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
                >
                    {/* Interior Lighting - Warmer & Brighter */}
                    <motion.div 
                        animate={isFocused ? { opacity: 0.3 } : { opacity: 0.15 }}
                        className="absolute inset-0 bg-brand-gold blur-[100px] -z-10"
                    />
                    
                    {/* Design Elements */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-gold/10 blur-[80px] rounded-full" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        {/* More Compact Icon */}
                        <div className="relative w-16 h-16 mx-auto mb-6">
                             <div className="absolute inset-0 bg-brand-gold/20 rounded-2xl blur-lg" />
                             <div className="relative w-full h-full bg-white/10 border border-white/20 flex items-center justify-center text-brand-gold">
                                <Mail size={32} />
                             </div>
                        </div>

                        <span className="text-brand-gold font-bold tracking-[0.4em] uppercase text-[9px] mb-3 block">
                            Privileged Invitation
                        </span>
                        
                        <h2 className="text-3xl md:text-5xl font-cinzel text-white mb-6 leading-tight tracking-tight">
                            Join the <span className="text-brand-gold italic">Exclusive</span> Circle
                        </h2>
                        
                        <p className="text-zinc-300 text-base md:text-lg mb-8 max-w-xl mx-auto font-inter font-light leading-relaxed">
                            A curated briefing on <span className="text-white">luxury listings</span> and architectural trends.
                        </p>

                        <form onSubmit={handleSubmit} className="max-w-md mx-auto relative h-16">
                            <input 
                                type="email" 
                                placeholder="Email Address" 
                                value={email}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={status === 'loading' || status === 'success'}
                                className="w-full h-full pl-8 pr-38 bg-black/40 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-gold/50 transition-all"
                            />
                            
                            <button 
                                type="submit"
                                disabled={status === 'loading' || status === 'success'}
                                className={`absolute right-1.5 top-1.5 bottom-1.5 px-8 font-bold text-sm tracking-widest transition-all duration-500 flex items-center justify-center gap-2 ${
                                    status === 'success' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-brand-gold text-black hover:bg-white active:scale-95'
                                }`}
                            >
                                <AnimatePresence mode="wait">
                                    {status === 'loading' ? (
                                        <motion.div 
                                            key="loading"
                                            className="w-5 h-5 border-3 border-black/30 border-t-black rounded-full animate-spin" 
                                        />
                                    ) : status === 'success' ? (
                                        <motion.div key="success" className="flex items-center gap-2">
                                            <Check size={18} />
                                            <span>Subscribed</span>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="idle" className="flex items-center gap-2">
                                            <span>Subscribe</span>
                                            <ArrowRight size={18} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>
                        </form>
                        
                        <div className="mt-12 flex items-center justify-center gap-10">
                             <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
                                <Sparkles size={12} className="text-brand-gold/40" />
                                <span>Curated Insights</span>
                             </div>
                             <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
                                <Sparkles size={12} className="text-brand-gold/40" />
                                <span>Privacy First</span>
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
