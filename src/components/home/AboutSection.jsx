import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Linkedin, Mail, ArrowUpRight, Building, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { api } from '@/lib/api';
import LiquidButton from '@/components/shared/LiquidButton';

const AboutSection = () => {
  const [projects, setProjects] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [leadersLoading, setLeadersLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    if (leaders.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % leaders.length);
  }, [leaders.length]);

  const prevSlide = useCallback(() => {
    if (leaders.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + leaders.length) % leaders.length);
  }, [leaders.length]);

  // Fetch Leadership Data
  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        setLeadersLoading(true);
        const response = await api.management.getAll();
        // The API returns members in response.data.members
        setLeaders(response.data.members || []);
      } catch (error) {
        console.error('Failed to fetch leadership:', error);
      } finally {
        setLeadersLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  // Auto-slide logic
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 2000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Carousel Variants for 3D Layering
  const cardVariants = {
    center: {
      x: '0%',
      rotateY: 0,
      scale: 1.1,
      zIndex: 10,
      opacity: 1,
      filter: 'blur(0px) grayscale(0%) contrast(110%)',
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    },
    left: {
      x: '-45%',
      rotateY: 35,
      scale: 0.85,
      zIndex: 5,
      opacity: 0.4,
      filter: 'blur(4px) grayscale(100%) contrast(125%)',
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    },
    right: {
      x: '45%',
      rotateY: -35,
      scale: 0.85,
      zIndex: 5,
      opacity: 0.4,
      filter: 'blur(4px) grayscale(100%) contrast(125%)',
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    },
    hidden: {
      x: '0%',
      scale: 0.5,
      opacity: 0,
      zIndex: 0,
      filter: 'blur(10px) grayscale(100%)',
      transition: { duration: 0.4 }
    }
  };

  // Fetch Projects for Gallery
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.projects.getAll();
        
        let displayProjects = [];
        // Handle various potential API response structures
        if (Array.isArray(res)) {
            displayProjects = res;
        } else if (res.projects && Array.isArray(res.projects)) {
            displayProjects = res.projects;
        } else if (res.data && Array.isArray(res.data)) {
            displayProjects = res.data;
        } else if (res.data && res.data.projects && Array.isArray(res.data.projects)) {
            displayProjects = res.data.projects;
        }

        const fallbackProjects = [
            { _id: 'fallback-1', slug: 'the-grand-palace', title: 'The Grand Palace', location: { city: 'Gulshan' }, images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c'], type: 'Residential' },
            { _id: 'fallback-2', slug: 'skyline-heights', title: 'Skyline Heights', location: { city: 'Banani' }, images: ['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea'], type: 'Commercial' },
            { _id: 'fallback-3', slug: 'riverview-estate', title: 'Riverview Estate', location: { city: 'Bashundhara' }, images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c'], type: 'Mixed Use' },
            { _id: 'fallback-4', slug: 'urban-oasis', title: 'Urban Oasis', location: { city: 'Dhanmondi' }, images: ['https://images.unsplash.com/photo-1600573472592-401b489a3cdc'], type: 'Residential' },
            { _id: 'fallback-5', slug: 'tech-hub-tower', title: 'Tech Hub Tower', location: { city: 'Uttara' }, images: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d'], type: 'Commercial' },
            { _id: 'fallback-6', slug: 'lakeside-manor', title: 'Lakeside Manor', location: { city: 'Baridhara' }, images: ['https://images.unsplash.com/photo-1600607687644-c7171b42498f'], type: 'Residential' },
        ];

        // Fill with fallback if not enough API data to complete the 6-item grid
        if (displayProjects.length < 6) {
           displayProjects = [...displayProjects, ...fallbackProjects.slice(displayProjects.length, 6)];
        } else {
           displayProjects = displayProjects.slice(0, 6);
        }
        
        setProjects(displayProjects);

      } catch (error) {
         console.error("Failed to fetch projects, using fallback", error);
         setProjects([
            { _id: 'fallback-1', slug: 'the-grand-palace', title: 'The Grand Palace', location: { city: 'Gulshan' }, images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c'], type: 'Residential' },
            { _id: 'fallback-2', slug: 'skyline-heights', title: 'Skyline Heights', location: { city: 'Banani' }, images: ['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea'], type: 'Commercial' },
            { _id: 'fallback-3', slug: 'riverview-estate', title: 'Riverview Estate', location: { city: 'Bashundhara' }, images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c'], type: 'Mixed Use' },
            { _id: 'fallback-4', slug: 'urban-oasis', title: 'Urban Oasis', location: { city: 'Dhanmondi' }, images: ['https://images.unsplash.com/photo-1600573472592-401b489a3cdc'], type: 'Residential' },
            { _id: 'fallback-5', slug: 'tech-hub-tower', title: 'Tech Hub Tower', location: { city: 'Uttara' }, images: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d'], type: 'Commercial' },
            { _id: 'fallback-6', slug: 'lakeside-manor', title: 'Lakeside Manor', location: { city: 'Baridhara' }, images: ['https://images.unsplash.com/photo-1600607687644-c7171b42498f'], type: 'Residential' },
        ]);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section className="py-24 bg-zinc-950 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-royal-deep/40 to-transparent pointer-events-none" />
      
      <div className="max-container px-4 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
            <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl"
            >
                <span className="text-brand-gold font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
                    Who We Are
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-cinzel font-semibold text-white mb-6 leading-tight">
                    Architects of <br/> <span className="text-brand-gold">Legacy</span>
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed border-l-2 border-brand-gold/30 pl-6">
                    We are more than developers; we are visionaries dedicated to crafting spaces that inspire. 
                    From conceptualization to the final brick, our leadership team ensures every project adheres to 
                    global standards of luxury and sustainability.
                </p>
            </motion.div>
            
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
            >
                <LiquidButton 
                    href="/about" 
                    baseColor="bg-white/5"
                    liquidColor="fill-brand-gold/20"
                    className="border border-white/10 hover:border-brand-gold/50 !text-white"
                >
                    <span className="font-bold tracking-wider uppercase text-xs">Learn More</span>
                    <ArrowUpRight size={20} />
                </LiquidButton>
            </motion.div>
        </div>

        {/* Management Showcase - Dynamic 3D Carousel Redesign */}
        <div 
          className="relative h-[720px] mb-32 flex items-center justify-center overflow-hidden lg:overflow-visible"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Background Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-[120px] pointer-events-none" />

          {leadersLoading ? (
            <div className="flex items-center justify-center gap-8 w-full max-w-5xl">
                <div className="hidden md:block w-72 aspect-[3/4] bg-white/5 rounded-none animate-pulse blur-sm scale-90" />
                <div className="w-80 md:w-96 aspect-[3/4] bg-white/10 rounded-none animate-pulse relative">
                   <div className="absolute bottom-10 left-8 right-8 space-y-4">
                      <div className="h-8 bg-white/5 rounded w-3/4 animate-pulse" />
                      <div className="h-4 bg-white/5 rounded w-1/2 animate-pulse" />
                      <div className="h-16 bg-white/5 rounded w-full animate-pulse" />
                   </div>
                </div>
                <div className="hidden md:block w-72 aspect-[3/4] bg-white/5 rounded-none animate-pulse blur-sm scale-90" />
            </div>
          ) : leaders.length === 0 ? (
            <div className="text-center py-10 bg-white/5 border border-white/10 rounded-[3rem] px-12 backdrop-blur-3xl">
               <h3 className="text-2xl font-cinzel text-white mb-2">Architects are planning...</h3>
               <p className="text-zinc-500">The leadership team will be revealed shortly.</p>
            </div>
          ) : (
            <div className="relative w-full max-w-5xl h-full flex items-center justify-center [perspective:1400px] [transform-style:preserve-3d]">
              <AnimatePresence initial={false}>
                {leaders.map((leader, i) => {
                  let position = 'hidden';
                  if (i === activeIndex) position = 'center';
                  else if (i === (activeIndex - 1 + leaders.length) % leaders.length) position = 'left';
                  else if (i === (activeIndex + 1) % leaders.length) position = 'right';

                  // Support 4th card (deep stack)
                  const isVisible = position !== 'hidden';

                  return (
                    <motion.div
                      key={leader._id || i}
                      initial="hidden"
                      animate={position}
                      variants={cardVariants}
                      className="absolute w-[280px] md:w-[400px] cursor-pointer will-change-transform"
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      onDragEnd={(e, { offset }) => {
                        const swipeThreshold = 50;
                        if (offset.x > swipeThreshold) prevSlide();
                        else if (offset.x < -swipeThreshold) nextSlide();
                      }}
                      onClick={() => {
                        if (position === 'left') prevSlide();
                        if (position === 'right') nextSlide();
                      }}
                      style={{ 
                        pointerEvents: isVisible ? 'auto' : 'none',
                        visibility: isVisible ? 'visible' : 'hidden',
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      <div className={`
                        relative aspect-[3/4] overflow-hidden rounded-none bg-zinc-900 border transition-all duration-700
                        ${position === 'center' ? 'border-brand-gold/40 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]' : 'border-white/5 shadow-2xl'}
                      `}>
                        <Image 
                          src={leader.image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a'}
                          alt={leader.name}
                          fill
                          priority={i === activeIndex}
                          sizes="(max-width: 768px) 280px, 400px"
                          className="object-cover"
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

                        {/* Content Overlay */}
                        <div className={`
                          absolute bottom-0 left-0 w-full p-8 md:p-10 transition-all duration-700
                          ${position === 'center' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                        `}>
                          <div className="space-y-2">
                             <div className="space-y-1">
                                <h3 className="text-2xl md:text-2xl font-cinzel text-white leading-none tracking-tight">{leader.name}</h3>
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-px bg-brand-gold/40" />
                                   <span className="text-brand-gold text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase">{leader.role}</span>
                                </div>
                             </div>
                             
                             <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="pt-2 overflow-hidden"
                             >
                               <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 md:line-clamp-3 italic font-serif opacity-80">
                                 &quot;{leader.bio || "Crafting experiences that transcend traditional luxury boundaries."}&quot;
                               </p>
                               <div className="flex gap-4 mt-2">
                                   {leader.email && (
                                     <motion.a 
                                       href={`mailto:${leader.email}`}
                                       whileHover={{ scale: 1.1, backgroundColor: '#F59E0B', color: '#0F172A' }}
                                       className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center justify-center text-white transition-all"
                                     >
                                         <Mail size={20} />
                                     </motion.a>
                                   )}
                                   {leader.whatsapp && (
                                     <motion.a 
                                       href={`https://wa.me/${leader.whatsapp}`}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       whileHover={{ scale: 1.1, backgroundColor: '#25D366', color: '#FFFFFF' }}
                                       className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center justify-center text-white transition-all"
                                     >
                                         <MessageCircle size={20} />
                                     </motion.a>
                                   )}
                               </div>
                             </motion.div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Navigation Controls */}
          {!leadersLoading && leaders.length > 1 && (
            <>
              {/* Sideways Arrows for Desktop */}
              <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 left-0 right-0 justify-between items-center z-20 pointer-events-none px-4 md:px-8">
                <button 
                  onClick={prevSlide}
                  className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white hover:border-brand-gold hover:text-brand-gold hover:bg-brand-gold/10 transition-all group active:scale-95 pointer-events-auto backdrop-blur-sm"
                  aria-label="Previous leader"
                >
                  <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                
                <button 
                  onClick={nextSlide}
                  className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white hover:border-brand-gold hover:text-brand-gold hover:bg-brand-gold/10 transition-all group active:scale-95 pointer-events-auto backdrop-blur-sm"
                  aria-label="Next leader"
                >
                  <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Bottom Controls for Mobile & Dots for all */}
              <div className="absolute bottom-0 lg:bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 z-30">
                <button 
                  onClick={prevSlide}
                  className="lg:hidden w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white active:scale-95 backdrop-blur-md bg-black/20"
                >
                  <ChevronLeft size={24} />
                </button>
                
                <div className="flex gap-4">
                  {leaders.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`h-2 transition-all duration-500 rounded-full ${i === activeIndex ? 'w-12 bg-brand-gold' : 'w-3 bg-white/20 hover:bg-white/40'}`} 
                      aria-label={`Go to slide ${i+1}`}
                    />
                  ))}
                </div>

                <button 
                  onClick={nextSlide}
                  className="lg:hidden w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white active:scale-95 backdrop-blur-md bg-black/20"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Project Gallery - Staggered Masonry */}
        <div>
             <div className="mb-12 text-center">
                <span className="text-brand-emerald font-bold tracking-[0.2em] uppercase text-xs mb-3 block">
                    Our Portfolio
                </span>
                <h3 className="text-3xl md:text-5xl font-cinzel text-white">
                    Masterpieces <span className="text-zinc-500 font-serif italic">&</span> Milestones
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px]">
                {projects.map((project, i) => {
                    // Create irregular grid layout (zig-zag: 8-4, 4-8, 8-4...)
                    const isLarge = i % 4 === 0 || i % 4 === 3;
                    const colSpan = isLarge ? "md:col-span-8" : "md:col-span-4";
                    
                    return (
                        <motion.div
                            key={project._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className={`relative overflow-hidden group ${colSpan}`}
                        >
                            <Image 
                                src={project.images?.[0] || '/placeholder.jpg'}
                                alt={project.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            
                            {/* Glass Overlay on Hover */}
                            <div className="absolute inset-x-4 bottom-4 bg-black/60 backdrop-blur-md rounded-xl p-6 translate-y-[110%] group-hover:translate-y-0 transition-transform duration-500 flex justify-between items-center border border-white/10">
                                <div>
                                    <h4 className="text-white text-xl font-bold mb-1">{project.title}</h4>
                                    <div className="flex items-center gap-2 text-zinc-300 text-xs uppercase tracking-wider">
                                        <Building size={14} className="text-brand-gold" />
                                        <span>{project.location?.city}</span>
                                        <span className="w-1 h-1 rounded-full bg-zinc-500" />
                                        <span>{project.type || 'Residence'}</span>
                                    </div>
                                </div>
                                <Link href={`/projects/${project.slug || project._id}`} className="w-10 h-10 rounded-full bg-brand-gold text-black flex items-center justify-center hover:scale-110 transition-transform">
                                    <ArrowUpRight size={20} />
                                </Link>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
            
             <div className="mt-12 text-center">
                <Link href="/projects" className="inline-flex items-center gap-3 text-zinc-400 hover:text-brand-gold transition-colors font-medium uppercase tracking-widest text-sm">
                    <span>View All Projects</span>
                    <ArrowUpRight size={16} />
                </Link>
            </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
