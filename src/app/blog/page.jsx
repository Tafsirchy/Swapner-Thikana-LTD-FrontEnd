'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, ChevronLeft, ChevronRight, Layout } from 'lucide-react';
import BlogCard from '@/components/shared/BlogCard';
import LuxurySelect from '@/components/shared/LuxurySelect';
import { api } from '@/lib/api';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    page: 1,
    limit: 6

  });

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.blogs.getAll(filters);
      if (data.data) {
        setBlogs(data.data.blogs || []);
        if (data.data.pagination) {
          setTotalPages(data.data.pagination.pages);
        }
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-royal-deep pt-32 pb-24">
      <section className="mb-20">
        <div className="max-container px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-[0.2em] mb-6"
          >
            <BookOpen size={16} />
            Luxury Insights
          </motion.div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-zinc-100 mb-6 sm:mb-8 tracking-tight leading-tight">
            The <span className="text-brand-gold ">Luxe</span> Journal
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-400 text-base sm:text-lg leading-relaxed mb-8 sm:mb-12 px-4 sm:px-0">
            Stay ahead of the market with exclusive architectural insights, real estate investment strategies, and luxury lifestyle spotlights from our concierge team.
          </p>

           <div className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row items-end justify-center gap-4 px-4">
              <div className="flex flex-col items-start gap-1.5 w-full sm:max-w-md">
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest ml-4 hidden sm:block">Search Journals</label>
                <form onSubmit={handleSearch} className="w-full sm:relative">
                  <Search className="hidden sm:block sm:absolute sm:left-6 sm:top-1/2 sm:-translate-y-1/2 text-brand-gold" size={20} />
                  <label htmlFor="blog-search" className="sr-only">Search blog posts</label>
                  <input 
                    id="blog-search"
                    type="search"
                    inputMode="search"
                    placeholder="Search journals..." 
                    autoComplete="off"
                    className="w-full h-12 sm:h-auto bg-white/5 border border-white/10 rounded-xl sm:rounded-full sm:py-4 px-5 sm:pl-14 sm:pr-32 text-zinc-100 placeholder:text-zinc-500 focus:border-brand-gold/50 focus:ring-2 focus:ring-brand-gold/30 outline-none transition-all"
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value, page: 1})}
                  />
                  <button 
                    type="submit"
                    className="w-full h-11 sm:w-auto sm:absolute sm:right-2 sm:top-1.5 sm:bottom-1.5 sm:h-auto px-8 bg-brand-gold text-royal-deep font-bold text-sm rounded-xl sm:rounded-full hover:bg-brand-gold-light transition-all active:scale-95 shadow-lg shadow-brand-gold/20"
                  >
                    Search
                  </button>
                </form>
              </div>

              <div className="w-full sm:w-auto flex items-center gap-4 self-stretch sm:self-auto">
                 <div className="h-10 w-[1px] bg-white/10 hidden sm:block mt-6"></div>
                 <div className="flex flex-col items-start gap-1.5 w-full">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest ml-1">Category</label>
                    <LuxurySelect
                      value={filters.category}
                      onChange={(val) => setFilters(prev => ({ ...prev, category: val, page: 1 }))}
                      options={[
                        { label: 'All Topics', value: '' },
                        { label: 'Real Estate', value: 'Real Estate' },
                        { label: 'Lifestyle', value: 'Lifestyle' },
                        { label: 'Investment', value: 'Investment' },
                        { label: 'Market Trends', value: 'Market Trends' },
                        { label: 'Construction', value: 'Construction' }
                      ]}
                      placeholder="All Topics"
                      icon={<Layout size={18} />}
                      className="rounded-xl !py-4 sm:w-52 !bg-white/5 !border-white/10"
                    />
                 </div>
              </div>
            </div>
           </div>
        </div>
      </section>

      <section>
        <div className="max-container px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white/5 rounded-3xl h-[450px] animate-pulse border border-white/5"></div>
               ))}
            </div>
          ) : blogs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
                {blogs.map((post) => (
                  <BlogCard key={post._id} post={post} />
                ))}
              </div>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4">
                   <button 
                      onClick={() => handlePageChange(Math.max(1, filters.page - 1))}
                      disabled={filters.page === 1}
                      aria-label="Previous page"
                      className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-brand-gold hover:border-brand-gold/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-royal-deep disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                   >
                      <ChevronLeft size={20} />
                   </button>
                   
                   <span className="text-xs sm:text-sm font-bold text-zinc-500 tracking-wider sm:tracking-widest">
                      PAGE <span className="text-brand-gold">{filters.page}</span> / {totalPages}
                   </span>

                   <button 
                      onClick={() => handlePageChange(Math.min(totalPages, filters.page + 1))}
                      disabled={filters.page === totalPages}
                      aria-label="Next page"
                      className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-brand-gold hover:border-brand-gold/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-royal-deep disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                   >
                      <ChevronRight size={20} />
                   </button>
                </div>
              )}
            </>
          ) : (
             <div className="text-center py-20 glass rounded-3xl border-white/5">
                <h3 className="text-2xl font-bold text-zinc-400 italic">No articles found</h3>
                <p className="text-zinc-500 mt-2">Try adjusting your search or check back later for new insights.</p>
             </div>
          )}
        </div>
      </section>

      {/* Featured Newsletter */}
      <section className="mt-32">
        <div className="max-container px-4">
          <div className="relative p-12 lg:p-20 bg-brand-gold rounded-[4rem] text-royal-deep overflow-hidden">
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="max-w-xl text-center md:text-left">
                  <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">Join the Executive Concierge List</h2>
                  <p className="text-royal-deep/80 text-lg font-medium">Receive monthly white-papers on Dhaka&apos;s luxury market and private architectural debuts.</p>
                </div>
                <div className="w-full max-w-md">
                   <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                      {/* Name field - Hidden on mobile for reduced friction */}
                      <div className="hidden sm:block">
                        <label htmlFor="newsletter-name" className="sr-only">Full Name</label>
                        <input 
                          id="newsletter-name"
                          type="text" 
                          placeholder="Full Name" 
                          autoComplete="name"
                          className="w-full h-12 bg-white/20 border border-royal-deep/10 rounded-2xl px-6 placeholder:text-royal-deep/60 placeholder:font-medium text-royal-deep font-bold focus:ring-2 focus:ring-royal-deep/30 focus:ring-offset-2 focus:ring-offset-transparent outline-none transition-all" 
                        />
                      </div>
                      
                      {/* Email field - Always visible */}
                      <div>
                        <label htmlFor="newsletter-email" className="sr-only">Email Address</label>
                        <input 
                          id="newsletter-email"
                          type="email" 
                          required
                          placeholder="Email Address" 
                          inputMode="email"
                          autoComplete="email"
                          className="w-full h-12 bg-white/20 border border-royal-deep/10 rounded-2xl px-6 placeholder:text-royal-deep/60 placeholder:font-medium text-royal-deep font-bold focus:ring-2 focus:ring-royal-deep/30 focus:ring-offset-2 focus:ring-offset-transparent outline-none transition-all" 
                        />
                      </div>
                      
                      {/* Button - Proper touch target */}
                      <button 
                        type="submit"
                        className="w-full h-14 bg-royal-deep text-white font-extrabold rounded-2xl hover:scale-[1.02] transition-all shadow-2xl active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        Subscribe Now
                      </button>
                   </form>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default BlogPage;
