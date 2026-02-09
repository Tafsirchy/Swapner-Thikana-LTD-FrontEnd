'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, ChevronLeft, 
  Loader2, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import ShareButton from '@/components/shared/ShareButton';
import { sanitize } from '@/utils/dompurify';

const BlogDetailClient = ({ slug, initialPost }) => {
  const [post, setPost] = useState(initialPost || null);
  const [loading, setLoading] = useState(!initialPost);

  const fetchPost = useCallback(async () => {
    if (initialPost) return;
    try {
      setLoading(true);
      const data = await api.blogs.getBySlug(slug);
      setPost(data.data.blog);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  }, [slug, initialPost]);

  useEffect(() => {
    fetchPost();
  }, [slug, fetchPost]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-royal-deep">
      <Loader2 size={48} className="text-brand-gold animate-spin" />
    </div>
  );

  if (!post) return (
     <div className="min-h-screen flex flex-col items-center justify-center bg-royal-deep text-center px-4">
        <h1 className="text-4xl font-bold text-zinc-100 mb-4 italic">Article Not Found</h1>
        <Link href="/blog" className="text-brand-gold flex items-center gap-2 hover:underline">
           <ChevronLeft size={20} /> Back to Journal
        </Link>
     </div>
  );

  return (
    <div className="min-h-screen bg-royal-deep pt-32 pb-24">
      <div className="max-container px-4">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="max-w-4xl mx-auto"
        >
          {/* Header Metadata */}
          <div className="flex items-center gap-3 mb-8">
             <Link href="/blog" className="p-3 rounded-xl bg-white/5 border border-white/10 text-brand-gold hover:bg-brand-gold hover:text-royal-deep transition-all">
                <ChevronLeft size={20} />
             </Link>
             <span className="px-4 py-1.5 bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] font-bold uppercase tracking-widest rounded-full">
                {post.category}
             </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-zinc-100 mb-8 sm:mb-10 leading-[1.15] tracking-tight">
             {post.title}
          </h1>

          <div className="space-y-6 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:gap-8 mb-12 sm:mb-16 pb-8 border-b border-white/10">
             {/* Author - Full width on mobile */}
             <div className="flex items-center gap-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-brand-gold flex items-center justify-center text-royal-deep font-bold text-xl uppercase shrink-0">
                   {post.author?.name?.[0] || 'A'}
                </div>
                <div className="flex-1 sm:flex-none">
                   <span className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Written by</span>
                   <span className="text-zinc-100 font-bold text-sm sm:text-base">{post.author?.name || 'Administrator'}</span>
                </div>
             </div>
             
             {/* Metadata - Horizontal on mobile */}
             <div className="flex items-center gap-6 sm:gap-10">
                <div className="flex flex-col gap-1">
                   <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Calendar size={12} /> Published
                   </span>
                   <span className="text-zinc-300 text-sm font-medium">{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-col gap-1">
                   <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Clock size={12} /> Read Time
                   </span>
                   <span className="text-zinc-300 text-sm font-medium">{post.readingTime} min read</span>
                </div>
             </div>
             
             {/* Share button - Full width on mobile */}
             <div className="sm:ml-auto">
                <ShareButton 
                   title={post.title}
                   text={`Read "${post.title}" on Shwapner Thikana`}
                />
             </div>
          </div>

          {/* Featured Image */}
          <div className="relative aspect-[16/9] w-full rounded-2xl sm:rounded-[3rem] overflow-hidden border border-white/10 mb-12 sm:mb-16 shadow-2xl">
             <Image 
                src={post.thumbnail || post.image} 
                alt={post.title} 
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                className="object-cover" 
                priority
             />
          </div>

          {/* Article Content */}
          <div className="prose prose-invert prose-brand-gold max-w-none">
             <div className="text-zinc-300 text-base sm:text-lg leading-relaxed space-y-6 sm:space-y-8">
                {post.content?.split('\n').map((para, i) => (
                   <div 
                     key={i} 
                     className={`mb-6 ${
                       i === 0 
                         ? 'sm:first-letter:text-6xl sm:first-letter:font-bold sm:first-letter:text-brand-gold sm:first-letter:float-left sm:first-letter:mr-4 sm:first-letter:mt-2' 
                         : ''
                     }`}
                     dangerouslySetInnerHTML={{ __html: sanitize(para) }}
                   />
                ))}
             </div>
          </div>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="mt-20 pt-10 border-t border-white/10 flex flex-wrap gap-3">
               {post.tags.map((tag, i) => (
                  <span key={i} className="px-5 py-2 bg-white/5 border border-white/5 text-zinc-400 text-sm rounded-full hover:border-brand-gold/30 cursor-pointer transition-all">
                     #{tag}
                  </span>
               ))}
            </div>
          )}

          {/* CTA / Internal Linking */}
          <div className="mt-20 sm:mt-32 p-8 sm:p-12 lg:p-16 glass rounded-3xl sm:rounded-[4rem] border-brand-gold/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
             <div className="relative z-10 text-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-3 sm:mb-4 italic">Interested in premium architectural projects?</h3>
                <p className="text-zinc-400 text-sm sm:text-base mb-8 sm:mb-10 max-w-xl mx-auto">Explore our iconic developments and find your piece of architectural excellence today.</p>
                <Link 
                   href="/projects" 
                   className="inline-flex items-center justify-center gap-3 bg-brand-gold text-royal-deep px-8 sm:px-10 h-14 sm:h-auto sm:py-5 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base hover:bg-brand-gold-light transition-all shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                   Discover Projects <ArrowRight size={20} />
                </Link>
             </div>
          </div>

          {/* Sticky Bottom CTA - Mobile Only */}
          <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-royal-deep/95 backdrop-blur-xl border-t border-white/10 p-4 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <Link 
              href="/projects"
              className="flex items-center justify-center gap-2 w-full h-14 bg-brand-gold text-royal-deep font-bold text-sm rounded-xl hover:bg-brand-gold-light transition-all active:scale-95 shadow-lg shadow-brand-gold/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Discover Projects <ArrowRight size={18} />
            </Link>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default BlogDetailClient;
