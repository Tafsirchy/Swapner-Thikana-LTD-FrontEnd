'use client';

import React from 'react';
import Link from 'next/link';
import SmartImage from './SmartImage';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Bookmark } from 'lucide-react';

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
      className="group bg-white/5 border border-white/10 rounded-none overflow-hidden hover:border-brand-gold/20 transition-all duration-500"
    >
      <div className="relative h-64 overflow-hidden">
        <SmartImage
          src={thumbnail || image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop'}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-royal-deep/60 to-transparent"></div>
        <div className="absolute top-6 left-6">
          <span className="px-4 py-1.5 bg-brand-gold text-royal-deep text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
            {category || 'Real Estate'}
          </span>
        </div>
        <button className="absolute top-6 right-6 p-2 rounded-full bg-black/20 backdrop-blur-md text-white hover:text-brand-gold transition-colors">
          <Bookmark size={18} />
        </button>
      </div>

      <div className="p-8">
        <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-brand-gold" />
            {new Date(createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1.5">
            <User size={14} className="text-brand-gold" />
            By {author || 'Admin'}
          </div>
        </div>

        <Link href={`/blog/${slug}`}>
          <h3 className="text-2xl font-bold text-zinc-100 mb-4 line-clamp-2 group-hover:text-brand-gold transition-colors leading-tight">
            {title}
          </h3>
        </Link>

        <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3">
          {excerpt}
        </p>

        <Link 
          href={`/blog/${slug}`}
          className="inline-flex items-center gap-2 text-brand-gold font-bold text-sm group/btn"
        >
          Read Full Insight
          <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </motion.article>
  );
};

export default BlogCard;
