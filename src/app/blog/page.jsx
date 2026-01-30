'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import BlogCard from '@/components/shared/BlogCard';
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
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-zinc-100 mb-8 tracking-tight">
            The <span className="text-brand-gold ">Luxe</span> Journal
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-400 text-lg leading-relaxed mb-12">
            Stay ahead of the market with exclusive architectural insights, real estate investment strategies, and luxury lifestyle spotlights from our concierge team.
          </p>

          <div className="max-w-xl mx-auto relative group">
            <form onSubmit={handleSearch}>
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-gold" size={20} />
              <input 
                type="text" 
                placeholder="Search journals and insights..." 
                className="w-full bg-white/5 border border-white/10 rounded-full py-5 pl-14 pr-32 text-zinc-100 focus:border-brand-gold/40 outline-none transition-all"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
              <button 
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-8 bg-brand-gold text-royal-deep font-bold rounded-full hover:bg-brand-gold-light transition-all active:scale-95 shadow-lg shadow-brand-gold/20"
              >
                Search
              </button>
            </form>
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
                      className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-brand-gold hover:border-brand-gold/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                   >
                     <ChevronLeft size={20} />
                   </button>
                   
                   <span className="text-sm font-bold text-zinc-500 tracking-widest">
                      PAGE <span className="text-brand-gold">{filters.page}</span> / {totalPages}
                   </span>

                   <button 
                      onClick={() => handlePageChange(Math.min(totalPages, filters.page + 1))}
                      disabled={filters.page === totalPages}
                      className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-brand-gold hover:border-brand-gold/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
                      <input type="text" placeholder="Full Name" className="w-full bg-white/20 border border-royal-deep/10 rounded-2xl px-6 py-4 placeholder:text-royal-deep/60 placeholder:font-medium text-royal-deep font-bold" />
                      <input type="email" placeholder="Email Address" className="w-full bg-white/20 border border-royal-deep/10 rounded-2xl px-6 py-4 placeholder:text-royal-deep/60 placeholder:font-medium text-royal-deep font-bold" />
                      <button className="w-full py-5 bg-royal-deep text-white font-extrabold rounded-2xl hover:scale-[1.02] transition-all shadow-2xl active:scale-95">
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
