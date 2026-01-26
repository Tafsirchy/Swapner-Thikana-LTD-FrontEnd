'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, ChevronLeft, 
  Share2, Loader2, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.blogs.getBySlug(slug);
      setPost(data.data.blog);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

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

          <h1 className="text-5xl md:text-7xl font-bold text-zinc-100 mb-10 leading-tight tracking-tight">
             {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-8 mb-16 pb-8 border-b border-white/10">
             <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-gold flex items-center justify-center text-royal-deep font-bold text-xl uppercase">
                   {post.author?.name?.[0] || 'A'}
                </div>
                <div>
                   <span className="block text-zinc-400 text-xs font-bold uppercase tracking-widest">Writen by</span>
                   <span className="text-zinc-100 font-bold">{post.author?.name || 'Administrator'}</span>
                </div>
             </div>
             <div className="flex items-center gap-10">
                <div className="flex flex-col gap-1">
                   <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-1">
                      <Calendar size={12} /> Published
                   </span>
                   <span className="text-zinc-300 text-sm font-medium">{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-col gap-1">
                   <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-1">
                      <Clock size={12} /> Read Time
                   </span>
                   <span className="text-zinc-300 text-sm font-medium">{post.readingTime} min read</span>
                </div>
             </div>
             <div className="ml-auto flex gap-4">
                <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 hover:text-brand-gold hover:border-brand-gold/50 transition-all">
                   <Share2 size={20} />
                </button>
             </div>
          </div>

          {/* Featured Image */}
          <div className="relative aspect-[16/9] w-full rounded-[3rem] overflow-hidden border border-white/10 mb-16 shadow-2xl">
             <Image 
                src={post.thumbnail || post.image} 
                alt={post.title} 
                fill 
                className="object-cover" 
                priority
             />
          </div>

          {/* Article Content */}
          <div className="prose prose-invert prose-brand-gold max-w-none">
             <div className="text-zinc-300 text-xl leading-relaxed space-y-8 first-letter:text-7xl first-letter:font-bold first-letter:text-brand-gold first-letter:float-left first-letter:mr-4 first-letter:mt-2">
                {post.content?.split('\n').map((para, i) => (
                   <p key={i} className="mb-6">{para}</p>
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
          <div className="mt-32 p-12 lg:p-16 glass rounded-[4rem] border-brand-gold/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
             <div className="relative z-10 text-center">
                <h3 className="text-3xl font-bold text-zinc-100 mb-4 italic">Interested in premium architectural projects?</h3>
                <p className="text-zinc-400 mb-10 max-w-xl mx-auto">Explore our iconic developments and find your piece of architectural excellence today.</p>
                <Link 
                   href="/projects" 
                   className="inline-flex items-center gap-3 bg-brand-gold text-royal-deep px-10 py-5 rounded-2xl font-bold hover:bg-brand-gold-light transition-all shadow-lg active:scale-95"
                >
                   Discover Projects <ArrowRight size={20} />
                </Link>
             </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
