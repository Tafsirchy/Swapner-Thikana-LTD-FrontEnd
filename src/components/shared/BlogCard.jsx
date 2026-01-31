'use client';

import React from 'react';
import Link from 'next/link';
import SmartImage from './SmartImage';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Bookmark } from 'lucide-react';
import LiquidButton from './LiquidButton';

const BlogCard = ({ post }) => {
  const {
    title,
    slug,
    category,
    image,
    thumbnail,
    excerpt,
    author,
    createdAt
  } = post;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-[#0a0f1a] border border-white/5 overflow-hidden transition-all duration-700 hover:border-brand-gold/20"
    >
      {/* Decorative Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

      {/* Image Section */}
      <div className="relative aspect-video overflow-hidden">
        <SmartImage
          src={thumbnail || image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop'}
          alt={title}
          fill
          className="object-cover transition-all duration-[1.5s] ease-out group-hover:scale-110 group-hover:rotate-1"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700"></div>
        
        {/* Floating Category Badge */}
        <div className="absolute top-6 left-6">
          <span className="px-5 py-2 bg-brand-gold text-royal-deep text-[9px] font-black uppercase tracking-[0.3em] shadow-[0_10px_20px_-5px_rgba(212,175,55,0.4)] transition-transform duration-500 group-hover:-translate-y-1">
            {category || 'Lifestyle'}
          </span>
        </div>
      </div>

      {/* Metadata Panel - Floating & Overlapping */}
      <div className="relative px-8 pb-10 pt-12">
        {/* Date/Author Glass Panel */}
        <div className="absolute -top-10 left-8 right-8 bg-zinc-950/80 backdrop-blur-xl border border-white/5 p-4 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 shadow-2xl transition-transform duration-700 group-hover:-translate-y-2">
          <div className="flex items-center gap-3">
            <Calendar size={12} className="text-brand-gold" />
            <span className="opacity-80">{new Date(createdAt).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
          </div>
          <div className="w-px h-3 bg-white/10"></div>
          <div className="flex items-center gap-3">
            <User size={12} className="text-brand-gold" />
            <span className="truncate max-w-[100px]">By {author || 'Admin'}</span>
          </div>
        </div>

        {/* Content */}
        <Link href={`/blog/${slug}`} className="block relative group/title">
          <h3 className="text-2xl font-cinzel font-bold text-zinc-100 mb-6 leading-[1.2] transition-colors duration-500 group-hover:text-brand-gold">
            {title}
          </h3>
          {/* Animated Accent Line */}
          <div className="absolute -bottom-2 left-0 w-12 h-[1px] bg-brand-gold/30 transition-all duration-700 group-hover:w-full group-hover:bg-brand-gold"></div>
        </Link>

        <p className="text-zinc-400 text-sm leading-relaxed font-serif italic mb-8 line-clamp-3 opacity-70 group-hover:opacity-100 transition-opacity duration-700">
          {excerpt}
        </p>

        <Link 
          href={`/blog/${slug}`}
          className="inline-flex items-center gap-4 text-brand-gold font-black text-[10px] uppercase tracking-[0.4em] group/link"
        >
          <span className="relative overflow-hidden">
            <span className="block transition-transform duration-500 group-hover:-translate-y-full">Read Full Insight</span>
            <span className="absolute top-0 left-0 block transition-transform duration-500 translate-y-full group-hover:translate-y-0 text-white">Read Full Insight</span>
          </span>
          <div className="w-8 h-8 rounded-full border border-brand-gold/20 flex items-center justify-center transition-all duration-500 group-hover:bg-brand-gold group-hover:text-royal-deep">
             <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>
    </motion.article>
  );
};

export default BlogCard;
