'use client';

import React from 'react';
import Link from 'next/link';
import SmartImage from './SmartImage';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';

const ProjectCard = ({ project }) => {
  const {
    title,
    slug,
    location,
    status,
    images,
    description,
    completionDate
  } = project;

  const statusColors = {
    ongoing: 'bg-brand-gold text-royal-deep',
    completed: 'bg-brand-emerald text-white',
    upcoming: 'bg-brand-royal text-white'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="group relative bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-brand-gold/30 transition-all duration-500"
    >
      <div className="relative h-80 w-full">
        <SmartImage
          src={images?.[0] || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop'}
          alt={title}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-royal-deep via-royal-deep/40 to-transparent"></div>
        
        <div className="absolute top-6 left-6">
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg ${statusColors[status] || 'bg-zinc-800 text-white'}`}>
            {status}
          </span>
        </div>
      </div>

      <div className="p-8 relative -mt-20 z-10">
        <div className="bg-royal-deep/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl">
          <h3 className="text-2xl font-bold text-zinc-100 mb-3 group-hover:text-brand-gold transition-colors">{title}</h3>
          
          <div className="flex items-center gap-2 text-zinc-400 text-sm mb-4">
            <MapPin size={16} className="text-brand-gold" />
            <span>{location.city}</span>
          </div>

          <p className="text-zinc-400 text-sm line-clamp-2 mb-6 italic leading-relaxed">
            {description}
          </p>

          <div className="flex items-center justify-between pt-6 border-t border-white/5">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-brand-gold" />
              <span className="text-xs font-medium text-zinc-300">Completion: {completionDate || 'TBA'}</span>
            </div>
            <Link 
              href={`/projects/${slug}`}
              className="flex items-center gap-2 text-brand-gold text-sm font-bold hover:gap-3 transition-all"
            >
              Learn More
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
