'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Building2, MapPin, Calendar, CheckCircle2, 
  Loader2, Mail, Phone
} from 'lucide-react';
import { api } from '@/lib/api';

const ProjectDetailPage = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.projects.getBySlug(slug);
      setProject(data.data.project);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProject();
  }, [slug, fetchProject]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-royal-deep">
      <Loader2 size={48} className="text-brand-gold animate-spin" />
    </div>
  );

  if (!project) return null;

  return (
    <div className="min-h-screen bg-royal-deep pt-24 pb-20">
      {/* Immersive Header */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <Image 
          src={project.images?.[0] || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop'} 
          alt={project.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-royal-deep via-transparent to-transparent"></div>
        
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center w-full max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold text-royal-deep text-[10px] font-bold uppercase tracking-[0.2em] mb-4"
          >
            <Building2 size={16} />
            Iconic Portfolio
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold text-zinc-100 tracking-tight">{project.title}</h1>
        </div>
      </section>

      <div className="max-container px-4 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Project Details */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Architectural Vision */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
                <span className="w-10 h-1 bg-brand-gold rounded-full"></span>
                The Vision
              </h2>
              <div className="text-zinc-400 text-lg leading-relaxed space-y-4 italic">
                {project.description}
              </div>
            </div>

            {/* Project Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: <MapPin />, label: 'Location', value: project.location.city },
                { icon: <Calendar />, label: 'Status', value: project.status },
                { icon: <Building2 />, label: 'Units', value: 'Exclusive Collection' },
              ].map((item, i) => (
                <div key={i} className="p-6 glass rounded-3xl border-white/10 flex flex-col items-center text-center gap-2">
                  <div className="text-brand-gold mb-2">{item.icon}</div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{item.label}</span>
                  <span className="text-zinc-100 font-bold capitalize">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Features & Specifications */}
            <div className="p-10 bg-white/5 rounded-[3rem] border border-white/10">
              <h2 className="text-2xl font-bold text-zinc-100 mb-8 flex items-center gap-3">
                <CheckCircle2 className="text-brand-gold" size={24} />
                Project Specifications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                {[
                  'Bespoke interior design options',
                  'World-class 24/7 concierge',
                  'Smart home automated integration',
                  'Platinum certified green architecture',
                  'Private elevator access',
                  'State-of-the-art wellness club'
                ].map((spec, i) => (
                  <div key={i} className="flex items-center gap-3 py-3 border-b border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                    <span className="text-zinc-300 font-medium">{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Gallery Grid */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-zinc-100">Visual Portfolio</h2>
              <div className="grid grid-cols-2 gap-4">
                {project.images?.map((img, i) => (
                  <div key={i} className="relative h-64 rounded-3xl overflow-hidden group">
                    <Image src={img} alt="" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Project Contact */}
          <div className="space-y-8">
            <div className="p-8 glass rounded-[2.5rem] border-brand-gold/20 sticky top-28">
              <h3 className="text-xl font-bold text-zinc-100 mb-6">Concierge Booking</h3>
              <p className="text-zinc-400 text-sm mb-8">Schedule a private architectural tour or request a physical brochure.</p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-gold/20 transition-all cursor-pointer">
                  <div className="p-3 rounded-xl bg-brand-gold/10 text-brand-gold">
                    <Phone size={20} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Speak with Concierge</span>
                    <span className="text-zinc-100 font-bold">+880 1234 567 890</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-gold/20 transition-all cursor-pointer">
                  <div className="p-3 rounded-xl bg-brand-gold/10 text-brand-gold">
                    <Mail size={20} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Email Relations</span>
                    <span className="text-zinc-100 font-bold">concierge@stltd.com</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <h4 className="text-sm font-bold text-zinc-100 mb-4">Request Portfolio Access</h4>
                <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                  <input type="text" placeholder="Full Name" className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-3 text-sm" />
                  <input type="email" placeholder="Email Address" className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-3 text-sm" />
                  <button className="w-full py-4 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all shadow-lg">
                    Request Dossier
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
