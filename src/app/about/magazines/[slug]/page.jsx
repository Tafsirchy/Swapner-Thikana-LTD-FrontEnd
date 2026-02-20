'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Download, Calendar, User, ArrowLeft, Loader2, Share2, Copy } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

const MagazineDetailsPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [magazine, setMagazine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isShareHovered, setIsShareHovered] = useState(false);

  useEffect(() => {
    const fetchMagazine = async () => {
      try {
        setLoading(true);
        const response = await api.magazines.getBySlug(slug);
        setMagazine(response.data.magazine);
      } catch (error) {
        console.error('Error fetching magazine:', error);
        toast.error('Magazine not found');
        router.push('/about/magazines');
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchMagazine();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-royal-deep pt-32 pb-24 flex items-center justify-center">
        <Loader2 className="text-brand-gold animate-spin" size={48} />
      </div>
    );
  }

  if (!magazine) return null;

  return (
    <div className="min-h-screen bg-royal-deep pt-24 sm:pt-32 pb-16 sm:pb-24">
      <div className="max-container px-4">
        {/* Back Button */}
        <Link 
          href="/about/magazines"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-brand-gold transition-colors mb-8 sm:mb-12 group p-2 -ml-2"
          aria-label="Back to Magazines"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm sm:text-base">Back to Magazines</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Left: Magazine Cover */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5"
          >
            <div className="relative aspect-[3/4] overflow-hidden shadow-2xl shadow-black/50 border border-white/5 group">
              <Image 
                src={magazine.coverImage || '/placeholder-magazine.jpg'}
                alt={magazine.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-royal-deep/40 to-transparent"></div>
            </div>

            <div className="mt-8 flex gap-4">
              <a 
                href={magazine.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-3 bg-brand-gold text-royal-deep py-5 font-bold hover:bg-brand-gold-light transition-all shadow-xl shadow-brand-gold/20 active:scale-95"
              >
                <Download size={20} />
                Download PDF Issue
              </a>
              <button 
                onClick={() => {
                   navigator.clipboard.writeText(window.location.href);
                   toast.success('Link copied to clipboard');
                }}
                onMouseEnter={() => setIsShareHovered(true)}
                onMouseLeave={() => setIsShareHovered(false)}
                className="p-5 bg-white/5 border border-white/10 text-zinc-300 hover:bg-brand-gold/10 hover:text-brand-gold hover:border-brand-gold/30 transition-all active:scale-95 duration-300"
              >
                <div className="relative">
                  <motion.div
                    initial={false}
                    animate={{ 
                      scale: isShareHovered ? 0 : 1,
                      opacity: isShareHovered ? 0 : 1,
                      rotate: isShareHovered ? -90 : 0
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Share2 size={24} />
                  </motion.div>
                  <motion.div
                    initial={false}
                    animate={{ 
                      scale: isShareHovered ? 1 : 0,
                      opacity: isShareHovered ? 1 : 0,
                      rotate: isShareHovered ? 0 : 90
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Copy size={24} />
                  </motion.div>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Right: Details Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 flex flex-col pt-4"
          >
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-3 sm:px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                {magazine.publisher || 'Swapner Thikana'}
              </span>
              <span className="flex items-center gap-2 text-zinc-400 text-xs sm:text-sm font-medium">
                <Calendar size={14} className="sm:size-4" />
                {magazine.publicationDate ? new Date(magazine.publicationDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'Recent'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-zinc-100 mb-6 sm:mb-8 leading-[1.1] tracking-tight">
              {magazine.title}
            </h1>

            <div className="p-5 sm:p-8 bg-white/5 border border-white/10 mb-8 sm:mb-10">
              <h3 className="text-zinc-100 text-sm sm:text-base font-bold mb-4 flex items-center gap-2">
                <BookOpen size={18} className="text-brand-gold" />
                Issue Overview
              </h3>
              <p className="text-zinc-400 text-base sm:text-lg leading-relaxed italic">
                "{magazine.description}"
              </p>
            </div>

            <div className="prose prose-invert prose-zinc max-w-none">
               <h3 className="text-2xl font-bold text-white mb-6">Inside this Issue</h3>
               <div className="space-y-6 text-zinc-300 text-lg leading-relaxed whitespace-pre-wrap">
                  {magazine.details || 'No detailed content available for this issue yet. Stay tuned for our feature stories and interview highlights.'}
               </div>
            </div>

            {/* Author/Publisher Info */}
            <div className="mt-16 pt-12 border-t border-white/10 flex items-center gap-6">
               <div className="h-16 w-16 rounded-2xl bg-brand-gold/20 flex items-center justify-center text-brand-gold">
                  <User size={32} />
               </div>
               <div>
                  <h4 className="text-white font-bold text-xl">{magazine.publisher || 'Swapner Thikana Limited'}</h4>
                  <p className="text-zinc-500 font-medium uppercase tracking-widest text-xs">Official Publication Department</p>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MagazineDetailsPage;
