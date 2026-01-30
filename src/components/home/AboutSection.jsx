'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Linkedin, Mail, ArrowUpRight, Building } from 'lucide-react';
import { api } from '@/lib/api';
import LiquidButton from '@/components/shared/LiquidButton';

const AboutSection = () => {
  const [projects, setProjects] = useState([]);
  
  // Reuse leadership data
  const leaders = [
    {
      name: "Tafsir Chowdhury",
      role: "Founder & CEO",
      bio: "With over 15 years of experience in global real estate markets, Tafsir founded Shwapner Thikana to redefine luxury living in Bangladesh.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1200",
    },
    {
      name: "Nusrat Jahan",
      role: "Director of Operations",
      bio: "An expert in operational excellence and strategic growth, Nusrat ensures our global standards are met across all branches.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200",
    },
    {
      name: "Arif Ahmed",
      role: "Head of Architecture",
      bio: "Arif leads our design vision, bridging the gap between traditional aesthetics and modern sustainable architecture.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1200",
    }
  ];

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

        {/* Management Showcase - Creative Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
            {leaders.map((leader, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.7 }}
                    className="group relative h-[450px] overflow-hidden cursor-pointer"
                >
                    <Image 
                        src={leader.image}
                        alt={leader.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500" />
                    
                    {/* Hover Content */}
                    <div className="absolute bottom-0 left-0 w-full p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="overflow-hidden">
                            <h3 className="text-2xl font-cinzel text-white mb-1 transform translate-y-0 transition-transform">{leader.name}</h3>
                            <span className="text-brand-gold text-xs font-bold tracking-widest uppercase block mb-4">{leader.role}</span>
                            
                            <div className="h-0 group-hover:h-auto opacity-0 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                                <p className="text-zinc-300 text-sm mb-6 line-clamp-3">
                                    {leader.bio}
                                </p>
                                <div className="flex gap-4">
                                    <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-gold hover:text-black transition-colors">
                                        <Linkedin size={18} />
                                    </button>
                                     <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-gold hover:text-black transition-colors">
                                        <Mail size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
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
