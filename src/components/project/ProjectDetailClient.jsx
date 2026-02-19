'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import SmartImage from '../shared/SmartImage';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, MapPin, CheckCircle2, 
  Phone, Send, Loader2, ChevronLeft, ChevronRight,
  Info, LayoutGrid, ListChecks, Share2, Download, ShieldCheck, X,
  Armchair, Utensils, Bath, Bed, Wind, Layers
} from 'lucide-react';
import LiquidButton from '../shared/LiquidButton';
import ShareButton from '../shared/ShareButton';
import DownloadBrochure from '../shared/DownloadBrochure';
import LuxAccordion from '../shared/LuxAccordion';
import { api } from '@/lib/api';
import dynamic from 'next/dynamic';

const PropertyMap = dynamic(() => import('../map/PropertyMap'), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-white/5 animate-pulse rounded-[3rem] border border-white/10" />
});

const NearbyPlaces = dynamic(() => import('../shared/NearbyPlaces'), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-white/5 animate-pulse rounded-[3rem] border border-white/10" />
});

import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import logger from '@/utils/logger';
import { sanitize } from '@/utils/dompurify';

const ProjectDetailClient = ({ project }) => {
  const { user } = useAuth();
  const [inquiry, setInquiry] = useState({
    name: '',
    phone: '',
    email: '',
    message: `I am interested in ${project?.title}. Please contact me with more information.`,
    propertyId: project?._id,
    interestType: 'project'
  });
  const [submitting, setSubmitting] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  // Track recently viewed
  useEffect(() => {
    if (project?._id && user) {
      api.user.addRecentlyViewed(project._id).catch(err => {
        console.error('Failed to track project view:', err);
      });
    }
  }, [project?._id, user]);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.leads.create(inquiry);
      toast.success('Your inquiry has been received. Our team will contact you soon.');
      setInquiry({ ...inquiry, name: '', phone: '', email: '', message: '' });
      setShowInquiryModal(false);
    } catch (err) {
      logger.error('Inquiry submission failed', err);
      toast.error('Failed to send inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!project) return null;

  return (
    <div className="min-h-screen bg-royal-deep pt-16 md:pt-24 pb-32 md:pb-20">
      {/* 1. Immersive Hero Gallery (SM: Scrollable / MD+: Visual impact) */}
      <section className="relative h-[45vh] md:h-[65vh] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <SmartImage 
              src={project.images?.[activeImage] || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop'} 
              alt={project.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Dynamic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-royal-deep via-transparent to-transparent z-10"></div>
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-royal-deep to-transparent z-10"></div>

        {/* Desktop Controls */}
        <div className="hidden md:flex absolute inset-x-0 top-1/2 -translate-y-1/2 justify-between px-8 z-40">
          <button 
            onClick={() => setActiveImage(prev => (prev === 0 ? project.images.length - 1 : prev - 1))}
            className="p-4 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-brand-gold hover:text-royal-deep transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-royal-deep"
            aria-label="Previous image"
            aria-controls="project-gallery"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => setActiveImage(prev => (prev === project.images.length - 1 ? 0 : prev + 1))}
            className="p-4 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-brand-gold hover:text-royal-deep transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-royal-deep"
            aria-label="Next image"
            aria-controls="project-gallery"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Featured Actions (Top Right) */}
        <div className="absolute top-8 right-4 md:right-8 z-40 flex items-center gap-3 md:gap-4">
          <ShareButton 
             title={project.title} 
             text={`Explore ${project.title} - A Shwapner Thikana Masterpiece.`}
             image={project.images?.[0]}
             price={project.status || 'Exclusive Project'}
             location={project.address || project.location?.address}
          />
          <DownloadBrochure project={project} />
        </div>

        {/* Mobile Swipe Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1.5 z-40">
          {project.images?.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${activeImage === idx ? 'w-8 bg-brand-gold' : 'w-2 bg-white/40'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      <div className="max-container px-4 md:px-6 relative z-10 -mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          
          {/* Main Content Pillar */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Header Content (Crucial on SM) */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-[10px] font-bold uppercase tracking-[0.2em]">
                <Building2 size={14} />
                {project.status || 'Ongoing Project'}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-zinc-100 tracking-tight leading-tight break-all break-words hyphens-auto">
                {project.title}
              </h1>
              <div className="flex items-center gap-3 text-zinc-400">
                <MapPin size={18} className="text-brand-gold shrink-0" />
                <span className="text-sm md:text-lg italic break-all">{project.address || project.location?.address}</span>
              </div>
            </div>

            {/* Quick Metrics (SM Accordion / LG Grid) */}
            <div className="md:hidden">
              <LuxAccordion title="Technical Overview" icon={Info} defaultOpen={true}>
                <div className="grid grid-cols-1 min-[390px]:grid-cols-2 gap-3 mt-2">
                  {[
                    { label: "Land Size", value: project.landSize },
                    { label: "Building Height", value: project.floorConfiguration },
                    { label: "Total Units", value: project.totalUnits },
                    { label: "Units / Floor", value: project.unitsPerFloor },
                    { label: "Parking", value: project.parking },
                    { label: "Handover", value: project.handoverDate },
                    { label: "Available Units", value: project.availableFlats },
                    { label: "Price / SFT", value: project.pricePerSqFt ? `৳${project.pricePerSqFt}` : 'Consult' },
                  ].map((item, i) => (
                    <div key={i} className={`p-4 bg-white/5 border border-white/5 rounded-2xl ${item.value ? 'opacity-100' : 'hidden'}`}>
                      <span className="block text-[8px] uppercase tracking-widest text-zinc-500 font-bold mb-1">{item.label}</span>
                      <span className="text-zinc-100 font-bold text-xs">{item.value}</span>
                    </div>
                  ))}
                </div>
              </LuxAccordion>

              <LuxAccordion title="Specifications" icon={LayoutGrid}>
                <div className="space-y-6 pt-2">
                  <div className="grid grid-cols-1 min-[390px]:grid-cols-2 gap-3">
                     {[
                        { label: "Bedrooms", value: project.bedroomCount || project.bedroomCountNum, icon: Bed },
                        { label: "Bathrooms", value: project.bathroomCount || project.bathroomCountNum, icon: Bath },
                        { label: "Balcony", value: project.balconyCount, icon: Wind },
                        { label: "Lifts", value: project.lift, icon: Layers },
                     ].map((spec, i) => (
                        <div key={i} className={`flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl ${spec.value ? 'opacity-100' : 'hidden'}`}>
                           <spec.icon size={16} className="text-brand-gold" />
                           <div>
                              <span className="block text-[8px] uppercase tracking-widest text-zinc-500 font-bold">{spec.label}</span>
                              <span className="text-zinc-100 font-bold text-xs">{spec.value}</span>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                    <span className="block text-brand-gold font-bold text-[10px] uppercase tracking-widest mb-2">Unit Sizes</span>
                    <p className="text-zinc-400 text-xs leading-relaxed">{project.flatSize || 'Standard Units'}</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2">Apartment Features</h4>
                    <div className="grid grid-cols-1 min-[390px]:grid-cols-2 gap-y-3">
                      {(project.features?.length > 0 ? project.features : ['Drawing', 'Dining', 'Kitchen', 'Stair']).map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-zinc-400">
                          <CheckCircle2 size={12} className="text-brand-gold/60" />
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </LuxAccordion>

              <LuxAccordion title="Project Overview" icon={ListChecks}>
                <div 
                  className="text-zinc-400 text-sm leading-relaxed pt-2 break-all break-words"
                  dangerouslySetInnerHTML={{ __html: sanitize(project.description) }}
                />
              </LuxAccordion>
            </div>

            {/* Desktop-Only Layout (Preserving original richness) */}
            <div className="hidden md:block space-y-12">
               <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 space-y-8">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                     {[
                       { label: "Land Size", value: project.landSize },
                       { label: "Floors", value: project.floorConfiguration },
                       { label: "Total Units", value: project.totalUnits },
                       { label: "Units/Floor", value: project.unitsPerFloor },
                       { label: "Bedrooms", value: project.bedroomCount || project.bedroomCountNum },
                       { label: "Bathrooms", value: project.bathroomCount || project.bathroomCountNum },
                       { label: "Balcony", value: project.balconyCount },
                       { label: "Available", value: project.availableFlats },
                       { label: "Price / SFT", value: project.pricePerSqFt ? `৳${project.pricePerSqFt}` : 'Exclusive' },
                       { label: "Handover", value: project.handoverDate },
                     ].map((item, i) => (
                        <div key={i} className={`flex flex-col gap-1 ${item.value ? 'opacity-100' : 'hidden'}`}>
                           <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">{item.label}</span>
                           <span className="text-zinc-200 font-bold">{item.value}</span>
                        </div>
                     ))}
                  </div>
                  <div className="border-t border-white/10 pt-8">
                     <h3 
                        className="text-xl font-bold text-white mb-4 italic leading-relaxed break-words break-all"
                        dangerouslySetInnerHTML={{ __html: sanitize(project.description) }}
                     />
                     <div className="grid grid-cols-1 min-[540px]:grid-cols-3 gap-8 mt-10">
                        <div className="space-y-2">
                           <span className="text-brand-gold font-bold uppercase text-xs tracking-widest">Configuration</span>
                           <p className="text-zinc-400 text-sm leading-relaxed">{project.flatSize || 'Customizable Units'}</p>
                        </div>
                        <div className="space-y-2">
                           <span className="text-brand-gold font-bold uppercase text-xs tracking-widest">Infrastructure</span>
                           <div className="flex flex-wrap gap-x-4 gap-y-1">
                              {project.lift && <div className="text-zinc-400 text-sm flex items-center gap-1.5"><Layers size={14} /> {project.lift}</div>}
                              {project.stair && <div className="text-zinc-400 text-sm flex items-center gap-1.5"><ChevronRight size={14} className="rotate-45" /> Stair Available</div>}
                           </div>
                        </div>
                        <div className="space-y-2">
                           <span className="text-brand-gold font-bold uppercase text-xs tracking-widest">Amenities</span>
                           <p className="text-zinc-400 text-sm leading-relaxed">{project.commonFacilities}</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Visual Portfolio - Optimized Grid */}
            <div className="space-y-6 pt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl md:text-3xl font-bold text-zinc-100">Gallery</h2>
                <span className="text-xs text-brand-gold font-bold uppercase tracking-widest">({project.images?.length} Photos)</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {project.images?.map((img, i) => (
                  <div key={i} className={`relative rounded-2xl md:rounded-3xl overflow-hidden group border border-white/5 ${i === 0 ? 'col-span-2 row-span-2 h-64 md:h-[28rem]' : 'h-32 md:h-52'}`}>
                    <SmartImage 
                      src={img} 
                      alt="" 
                      fill 
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      className="object-cover transition-all duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* Location & Surroundings */}
            <div className="space-y-8 pt-12">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 tracking-tight">Location & <span className="text-brand-gold">Surroundings</span></h2>
                    <p className="text-zinc-500 mt-2 text-sm md:text-base">Explore the neighborhood and nearby essential amenities.</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                     <MapPin size={16} className="text-brand-gold" />
                     <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">{project.location?.city || 'Dhaka'}</span>
                  </div>
               </div>

               <div className="grid grid-cols-1 gap-8">
                  {/* Map Component */}
                  <div className="h-[400px] md:h-[500px] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border border-white/10 shadow-2xl relative group">
                     <PropertyMap property={project} />
                     <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <p className="text-white font-medium flex items-center gap-2">
                           <MapPin size={16} className="text-brand-gold" />
                           {project.address || project.location?.address}
                        </p>
                     </div>
                  </div>

                  {/* Nearby Places Grid */}
                  <div className="grid grid-cols-1 gap-6">
                     <NearbyPlaces 
                        address={project.address || project.location?.address} 
                        location={project.location}
                        isProject={true}
                     />
                  </div>
               </div>
            </div>

          </div>

          {/* Lateral Column - Sticky Sidebar for Desktop */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="p-8 glass bg-white/5 backdrop-blur-sm rounded-[3rem] border border-white/10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 flex items-center justify-center">
                    <Phone className="text-brand-gold" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg leading-tight">Sales Hotline</h3>
                    <p className="text-zinc-500 text-xs">Direct office assistance</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <a href="tel:01731227755" className="block p-5 rounded-2xl bg-zinc-900/80 border border-white/5 hover:border-brand-gold/50 transition-all font-bold text-2xl text-white tracking-tight">
                    01731 227 755
                  </a>
                  <a href="tel:01822335566" className="block p-5 rounded-2xl bg-zinc-900/80 border border-white/5 hover:border-brand-gold/50 transition-all font-bold text-2xl text-white tracking-tight font-serif italic text-brand-gold">
                    01822 335 566
                  </a>
                </div>

                <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
                   <h4 className="text-xs font-bold text-white uppercase tracking-widest text-center mb-6">Request Private Consultation</h4>
                   <form className="space-y-3" onSubmit={handleInquirySubmit}>
                      <div>
                        <label htmlFor="desktop-project-inquiry-name" className="sr-only">Name</label>
                        <input 
                           id="desktop-project-inquiry-name"
                           type="text" 
                           required
                           placeholder="Name"
                           autoComplete="name"
                           className="w-full h-12 bg-zinc-950/50 border border-white/5 rounded-2xl px-5 text-sm text-white placeholder:text-zinc-500 focus:border-brand-gold/50 focus:ring-2 focus:ring-brand-gold/30 focus:ring-offset-2 focus:ring-offset-transparent outline-none transition-all" 
                           value={inquiry.name}
                           onChange={(e) => setInquiry({...inquiry, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <label htmlFor="desktop-project-inquiry-email" className="sr-only">Email</label>
                        <input 
                           id="desktop-project-inquiry-email"
                           type="email" 
                           required
                           placeholder="Email Address"
                           autoComplete="email"
                           className="w-full h-12 bg-zinc-950/50 border border-white/5 rounded-2xl px-5 text-sm text-white placeholder:text-zinc-500 focus:border-brand-gold/50 focus:ring-2 focus:ring-brand-gold/30 focus:ring-offset-2 focus:ring-offset-transparent outline-none transition-all" 
                           value={inquiry.email}
                           onChange={(e) => setInquiry({...inquiry, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <label htmlFor="desktop-project-inquiry-phone" className="sr-only">Phone</label>
                        <input 
                           id="desktop-project-inquiry-phone"
                           type="tel" 
                           required
                           placeholder="Phone"
                           inputMode="tel"
                           autoComplete="tel"
                           className="w-full h-12 bg-zinc-950/50 border border-white/5 rounded-2xl px-5 text-sm text-white placeholder:text-zinc-500 focus:border-brand-gold/50 focus:ring-2 focus:ring-brand-gold/30 focus:ring-offset-2 focus:ring-offset-transparent outline-none transition-all" 
                           value={inquiry.phone}
                           onChange={(e) => setInquiry({...inquiry, phone: e.target.value})}
                        />
                      </div>
                      <LiquidButton 
                         type="submit"
                         disabled={submitting}
                         className="w-full mt-4 h-14"
                      >
                         {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Send Request'}
                      </LiquidButton>
                   </form>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Sticky Bottom Bar (Mobile First - Crucial for Conversion) */}
      <div className="fixed bottom-0 left-0 right-0 z-[1100] md:hidden">
         <div className="p-4 bg-zinc-950/90 backdrop-blur-2xl border-t border-white/10 flex gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <a 
              href="tel:01731227755" 
              className="flex-1 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-2 text-white font-bold text-sm active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              aria-label="Call sales hotline"
            >
               <Phone size={18} className="text-brand-gold" />
               Call Sales
            </a>
            <button 
              onClick={() => setShowInquiryModal(true)}
              className="flex-[1.5] h-14 rounded-2xl bg-brand-gold text-royal-deep font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-brand-gold/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Open inquiry form"
            >
               <Send size={18} />
               Inquire Now
            </button>
         </div>
      </div>

      {/* Mobile Inquiry Modal (Bottom Sheet Style) synchronized with Property Details */}
      <AnimatePresence>
        {showInquiryModal && (
          <div 
            className="fixed inset-0 z-[1200] md:hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-project-inquiry-modal-title"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInquiryModal(false)}
              className="absolute inset-0 bg-black/55 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 bg-zinc-950 rounded-t-[2.5rem] border-t border-white/10 p-8 pb-32 z-[1201] overflow-y-auto max-h-[90vh] custom-scrollbar"
              data-lenis-prevent
            >
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6" />
              <div className="flex items-center justify-between mb-6">
                <h3 id="mobile-project-inquiry-modal-title" className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                  <ShieldCheck className="text-brand-gold" size={24} />
                  Exclusive Inquiry
                </h3>
                <button 
                  onClick={() => setShowInquiryModal(false)}
                  className="p-2 bg-white/5 rounded-full text-zinc-400"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div>
                  <label htmlFor="mobile-project-inquiry-name" className="sr-only">Full Name</label>
                  <input 
                    id="mobile-project-inquiry-name"
                    type="text" 
                    required
                    placeholder="Your Full Name"
                    autoComplete="name"
                    className="w-full h-12 bg-zinc-800 border border-white/10 rounded-xl px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-brand-gold/50 focus:ring-2 focus:ring-brand-gold/30 focus:ring-offset-2 focus:ring-offset-transparent outline-none transition-all"
                    value={inquiry.name}
                    onChange={(e) => setInquiry({...inquiry, name: e.target.value})}
                  />
                </div>
                <div>
                  <label htmlFor="mobile-project-inquiry-email" className="sr-only">Email Address</label>
                  <input 
                    id="mobile-project-inquiry-email"
                    type="email" 
                    required
                    placeholder="Email Address"
                    inputMode="email"
                    autoComplete="email"
                    className="w-full h-12 bg-zinc-800 border border-white/10 rounded-xl px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-brand-gold/50 focus:ring-2 focus:ring-brand-gold/30 focus:ring-offset-2 focus:ring-offset-transparent outline-none transition-all"
                    value={inquiry.email}
                    onChange={(e) => setInquiry({...inquiry, email: e.target.value})}
                  />
                </div>
                <div>
                  <label htmlFor="mobile-project-inquiry-phone" className="sr-only">Phone Number</label>
                  <input 
                    id="mobile-project-inquiry-phone"
                    type="tel" 
                    required
                    placeholder="Phone Number"
                    inputMode="tel"
                    autoComplete="tel"
                    className="w-full h-12 bg-zinc-800 border border-white/10 rounded-xl px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-brand-gold/50 focus:ring-2 focus:ring-brand-gold/30 focus:ring-offset-2 focus:ring-offset-transparent outline-none transition-all"
                    value={inquiry.phone}
                    onChange={(e) => setInquiry({...inquiry, phone: e.target.value})}
                  />
                </div>
                <div className="md:block">
                  <label htmlFor="mobile-project-inquiry-message" className="sr-only">Message (Optional)</label>
                  <textarea 
                    id="mobile-project-inquiry-message"
                    rows="4"
                    placeholder="Additional message or preferences (optional)..."
                    className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-brand-gold/50 focus:ring-2 focus:ring-brand-gold/30 focus:ring-offset-2 focus:ring-offset-transparent outline-none resize-none transition-all"
                    value={inquiry.message}
                    onChange={(e) => setInquiry({...inquiry, message: e.target.value})}
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full h-14 bg-brand-gold text-royal-deep font-bold rounded-xl shadow-lg shadow-brand-gold/20 flex items-center justify-center gap-2 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Request Private Consultation</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetailClient;
