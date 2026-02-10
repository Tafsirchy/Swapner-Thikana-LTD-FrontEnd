'use client';

import React, { useState, useEffect } from 'react';
import SmartImage from '@/components/shared/SmartImage';
import dynamic from 'next/dynamic';
import { 
  MapPin, Bed, Bath, Move, Heart, Share2, 
  Calendar, CheckCircle2, ShieldCheck,
  ChevronLeft, ChevronRight, Loader2, Send, Calculator, X, FileText
} from 'lucide-react';
import DownloadBrochure from '@/components/shared/DownloadBrochure';
import ShareButton from '@/components/shared/ShareButton';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import logger from '@/utils/logger';
import { sanitize } from '@/utils/dompurify';
const MortgageCalculator = dynamic(() => import('@/components/tools/MortgageCalculator'), { ssr: false });
const NearbyPlaces = dynamic(() => import('@/components/shared/NearbyPlaces'), { ssr: false });
import ReviewSection from '@/components/property/ReviewSection';

// Dynamic import for map (client-side only)
const PropertyMap = dynamic(() => import('@/components/map/PropertyMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
      <Loader2 className="animate-spin text-brand-gold" size={32} />
    </div>
  )
});

const PropertyDetailClient = ({ initialProperty }) => {
  const { user } = useAuth();
  const [property] = useState(initialProperty);
  const [activeImage, setActiveImage] = useState(0);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  
  // Inquiry Form State
  const [inquiry, setInquiry] = useState({
    name: '',
    email: '',
    phone: '',
    message: 'I am interested in this luxury property. Please contact me with more details.',
    propertyId: initialProperty?._id,
    interestType: 'property'
  });
  const [submitting, setSubmitting] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  // Track recently viewed
  useEffect(() => {
    if (property?._id && user) {
      api.user.addRecentlyViewed(property._id).catch(err => {
        console.error('Failed to track view:', err);
      });
    }
  }, [property?._id, user]);

  const handleInquirySubmit = async (e) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    try {
      await api.leads.create(inquiry);
      toast.success('Your inquiry has been sent to the agent.');
      setInquiry({ ...inquiry, name: '', email: '', phone: '', message: '' });
      setShowInquiryModal(false);
    } catch (err) {
      toast.error('Failed to send inquiry. Please try again.');
      logger.error('Inquiry submission failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!property) return null;

  return (
    <div className="min-h-screen bg-royal-deep pt-20 md:pt-24 pb-32 md:pb-20">
      {/* Gallery Section - Responsive Height */}
      <section className="relative h-[45vh] md:h-[70vh] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <SmartImage 
              src={property.images?.[activeImage] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2075&auto=format&fit=crop'} 
              alt={property.title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-t from-royal-deep via-transparent to-transparent opacity-60 md:opacity-100 z-10"></div>
        
        {/* Featured Actions (Top Right) */}
        <div className="absolute top-8 right-4 md:right-8 z-50 flex items-center gap-3 md:gap-4">
          <ShareButton 
            title={property.title}
            text={`Check out this property: ${property.title}`}
            image={property.images?.[0]}
            price={`৳ ${property.price?.toLocaleString('en-BD')}`}
            location={`${property.location?.area}, ${property.location?.city}`}
          />
          <DownloadBrochure project={property} />
        </div>

        {/* Navigation Overlays (Hidden on smallest mobile, use swipe/dots) */}
        <div className="hidden md:flex absolute inset-x-0 top-1/2 -translate-y-1/2 justify-between px-8 z-40">
          <button 
            onClick={() => setActiveImage(prev => (prev === 0 ? property.images.length - 1 : prev - 1))}
            className="p-4 rounded-full glass border-white/20 text-white hover:bg-brand-gold hover:text-royal-deep transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-royal-deep"
            aria-label="Previous image"
            aria-controls="property-gallery"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => setActiveImage(prev => (prev === property.images.length - 1 ? 0 : prev + 1))}
            className="p-4 rounded-full glass border-white/20 text-white hover:bg-brand-gold hover:text-royal-deep transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-royal-deep"
            aria-label="Next image"
            aria-controls="property-gallery"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Image Indicators / Counter (Mobile First) */}
        <div className="absolute bottom-6 right-6 z-40 md:hidden flex items-center gap-2 px-3 py-1.5 glass rounded-full border-white/10 text-xs text-white">
          <span className="font-bold">{activeImage + 1}</span>
          <span className="opacity-40">/</span>
          <span className="opacity-40">{property.images?.length || 0}</span>
        </div>

        {/* Thumbnail Strip (Desktop only for scroll efficiency) */}
        <div className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 gap-4 p-2 glass rounded-2xl border-white/10 overflow-x-auto max-w-[90vw] z-40">
          {property.images?.map((img, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveImage(idx)}
              className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${activeImage === idx ? 'border-brand-gold' : 'border-transparent opacity-60'}`}
              aria-label={`View image ${idx + 1}`}
            >
              <SmartImage src={img} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      </section>

      <div className="max-container px-4 -mt-10 md:-mt-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 md:space-y-10">
            {/* Title & Price Header */}
            <div className="p-6 md:p-10 glass rounded-[2rem] md:rounded-[3rem] border-white/10">
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <span className="px-3 py-1 bg-brand-gold text-royal-deep text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-full">
                  {property.propertyType}
                </span>
                <span className="px-3 py-1 bg-white/5 text-zinc-300 text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/10">
                  {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-6">
                <div className="space-y-3">
                  <h1 className="text-2xl md:text-5xl font-bold text-zinc-100 leading-tight">{property.title}</h1>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <MapPin size={18} className="text-brand-gold shrink-0" />
                    <span className="text-sm md:text-lg">{property.location.address}, {property.location.area}, {property.location.city}</span>
                  </div>
                </div>
                <div className="md:text-right flex flex-col items-start md:items-end">
                  <div className="hidden md:flex justify-end mb-2">
                     {/* Brochure button moved to hero section */}
                  </div>
                  <span className="text-zinc-500 text-[10px] md:text-sm font-bold uppercase tracking-widest mb-1">Asking Price</span>
                  <div className="text-3xl md:text-4xl font-bold text-brand-gold">
                    ৳ {property.price?.toLocaleString('en-BD')}
                    {property.listingType === 'rent' && <span className="text-sm md:text-lg text-zinc-400 font-normal ml-1">/ mo</span>}
                  </div>
                </div>
              </div>

              {/* Quick Features (Scannable Grid) */}
              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-8 md:mt-12 pt-8 md:pt-10 border-t border-white/5">
                {[
                  { icon: <Bed size={22} />, label: 'Beds', value: property.bedrooms },
                  { icon: <Bath size={22} />, label: 'Baths', value: property.bathrooms },
                  { icon: <Move size={22} />, label: 'Sqft', value: property.size },
                  { icon: <Calendar size={22} />, label: 'Built', value: property.yearBuilt || '2023' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-brand-gold">
                      {item.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-zinc-100">{item.value}</span>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description (Prioritizing on mobile) */}
            <div className="p-6 md:p-10 bg-white/5 rounded-[2rem] md:rounded-[3rem] border border-white/10">
              <h2 className="text-xl md:text-2xl font-bold text-zinc-100 mb-4 md:mb-6 pb-3 md:pb-4 border-b border-white/10">About This Residence</h2>
              <div className="text-zinc-400 text-sm md:text-base leading-relaxed space-y-4">
                {property.description?.split('\n').filter(p => p).slice(0, 3).map((para, i) => (
                  <div key={i} dangerouslySetInnerHTML={{ __html: sanitize(para) }} />
                ))}
                
                {/* Collapsible Content for SM */}
                <AnimatePresence>
                  {property.description?.split('\n').filter(p => p).length > 3 && (
                    <motion.div
                      initial={false}
                      className="space-y-4"
                    >
                      {property.description?.split('\n').filter(p => p).slice(3).map((para, i) => (
                        <div key={i + 3} dangerouslySetInnerHTML={{ __html: sanitize(para) }} />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Amenities (Grid optimized for mobile) */}
            <div className="p-6 md:p-10 bg-white/5 rounded-[2rem] md:rounded-[3rem] border border-white/10">
              <h2 className="text-xl md:text-2xl font-bold text-zinc-100 mb-4 md:mb-6 pb-3 md:pb-4 border-b border-white/10 font-cinzel tracking-wider flex items-center gap-2">
                <ShieldCheck size={20} className="text-brand-gold" />
                Curated Amenities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
                {property.amenities?.map((amenity, i) => (
                  <div key={i} className="flex items-center gap-3 py-1">
                    <CheckCircle2 size={16} className="text-brand-emerald shrink-0" />
                    <span className="text-zinc-300 text-sm font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location section moved below primary info */}
            <div className="p-6 md:p-10 bg-white/5 rounded-[2rem] md:rounded-[3rem] border border-white/10">
               <h2 className="text-xl md:text-2xl font-bold text-zinc-100 mb-4 md:mb-6 pb-3 md:pb-4 border-b border-white/10 flex items-center gap-3">
                <MapPin className="text-brand-gold" size={24} />
                Prime Location
              </h2>
              <NearbyPlaces 
                lat={property.coordinates?.lat} 
                lng={property.coordinates?.lng}
                address={`${property.location.address}, ${property.location.city}`} 
              />
              <div className="mt-8 rounded-2xl overflow-hidden grayscale brightness-75 hover:grayscale-0 transition-all duration-700">
                <PropertyMap property={property} height="400px" />
              </div>
            </div>

            {/* Reviews Section */}
            <div className="p-6 md:p-10 bg-white/5 rounded-[2rem] md:rounded-[3rem] border border-white/10">
              <ReviewSection propertyId={property._id} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8 sticky top-28 h-fit">
            {/* Mortgage Calculator Button */}
            <button
              onClick={() => setShowCalculator(true)}
              className="w-full p-6 glass border-brand-gold/20 rounded-2xl hover:border-brand-gold/40 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center group-hover:bg-brand-gold/20 transition-colors">
                    <Calculator className="text-brand-gold" size={22} />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-zinc-100 mb-0.5">Calculate Mortgage</h4>
                    <p className="text-xs text-zinc-400">Estimate monthly payments</p>
                  </div>
                </div>
                <ChevronRight className="text-zinc-500 group-hover:text-brand-gold transition-colors" size={20} />
              </div>
            </button>

            {/* Inquiry Form (Desktop Sidebar) */}
            <div className="hidden md:block p-8 glass rounded-[2.5rem] border-brand-gold/20 shadow-xl shadow-brand-gold/5">
              <h3 className="text-xl font-bold text-zinc-100 mb-6 flex items-center gap-2">
                <ShieldCheck className="text-brand-gold" size={24} />
                Exclusive Inquiry
              </h3>
              
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div>
                  <label htmlFor="desktop-inquiry-name" className="sr-only">Full Name</label>
                  <input 
                    id="desktop-inquiry-name"
                    type="text" 
                    required
                    placeholder="Your Full Name"
                    autoComplete="name"
                    className="w-full h-12 bg-zinc-900 border border-white/10 rounded-xl px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-brand-gold/50 focus:ring-2 focus:ring-brand-gold/30 focus:ring-offset-2 focus:ring-offset-transparent outline-none transition-all"
                    value={inquiry.name}
                    onChange={(e) => setInquiry({...inquiry, name: e.target.value})}
                  />
                </div>
                <div>
                  <label htmlFor="desktop-inquiry-email" className="sr-only">Email Address</label>
                  <input 
                    id="desktop-inquiry-email"
                    type="email" 
                    required
                    placeholder="Email Address"
                    inputMode="email"
                    autoComplete="email"
                    className="w-full h-12 bg-zinc-900 border border-white/10 rounded-xl px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-brand-gold/50 focus:ring-2 focus:ring-brand-gold/30 focus:ring-offset-2 focus:ring-offset-transparent outline-none transition-all"
                    value={inquiry.email}
                    onChange={(e) => setInquiry({...inquiry, email: e.target.value})}
                  />
                </div>
                <div>
                  <label htmlFor="desktop-inquiry-phone" className="sr-only">Phone Number</label>
                  <input 
                    id="desktop-inquiry-phone"
                    type="tel" 
                    required
                    placeholder="Phone Number"
                    inputMode="tel"
                    autoComplete="tel"
                    className="w-full h-12 bg-zinc-900 border border-white/10 rounded-xl px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-brand-gold/50 focus:ring-2 focus:ring-brand-gold/30 focus:ring-offset-2 focus:ring-offset-transparent outline-none transition-all"
                    value={inquiry.phone}
                    onChange={(e) => setInquiry({...inquiry, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label htmlFor="desktop-inquiry-message" className="sr-only">Message</label>
                  <textarea 
                    id="desktop-inquiry-message"
                    rows="4"
                    required
                    placeholder="Additional message or preferences..."
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-brand-gold/50 focus:ring-2 focus:ring-brand-gold/30 focus:ring-offset-2 focus:ring-offset-transparent outline-none resize-none transition-all"
                    value={inquiry.message}
                    onChange={(e) => setInquiry({...inquiry, message: e.target.value})}
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full h-14 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all active:scale-95 shadow-lg shadow-brand-gold/20 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Send Inquiry</>}
                </button>
              </form>
            </div>

            {/* Social Share */}
            <div className="flex justify-center gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-zinc-300 text-sm hover:border-brand-gold transition-all">
                <Heart size={16} /> Save
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-zinc-300 text-sm hover:border-brand-gold transition-all">
                <Share2 size={16} /> Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom CTA for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-zinc-950/80 backdrop-blur-xl border-t border-white/10 p-4 pb-8 flex items-center justify-between gap-4">
        <div>
          <span className="block text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Asking Price</span>
          <span className="text-xl font-bold text-brand-gold">৳ {property.price?.toLocaleString('en-BD')}</span>
        </div>
        <button
          onClick={() => setShowInquiryModal(true)}
          className="flex-1 h-14 bg-brand-gold text-royal-deep font-bold rounded-xl shadow-lg shadow-brand-gold/20 flex items-center justify-center gap-2 text-sm active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          aria-label="Open inquiry form"
        >
          <Send size={16} /> Inquire Now
        </button>
      </div>

      {/* Mobile Inquiry Modal (Bottom Sheet Style) */}
      <AnimatePresence>
        {showInquiryModal && (
          <div 
            className="fixed inset-0 z-[1000] md:hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-inquiry-modal-title"
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
              className="absolute bottom-0 left-0 right-0 bg-zinc-950 rounded-t-[2.5rem] border-t border-white/10 p-8 pb-32 z-[1001] overflow-y-auto max-h-[90vh] custom-scrollbar"
              data-lenis-prevent
            >
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6" />
              <div className="flex items-center justify-between mb-6">
                <h3 id="mobile-inquiry-modal-title" className="text-xl font-bold text-zinc-100 flex items-center gap-2">
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
                  <label htmlFor="mobile-inquiry-name" className="sr-only">Full Name</label>
                  <input 
                    id="mobile-inquiry-name"
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
                  <label htmlFor="mobile-inquiry-email" className="sr-only">Email Address</label>
                  <input 
                    id="mobile-inquiry-email"
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
                  <label htmlFor="mobile-inquiry-phone" className="sr-only">Phone Number</label>
                  <input 
                    id="mobile-inquiry-phone"
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
                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full h-14 bg-brand-gold text-royal-deep font-bold rounded-xl shadow-lg shadow-brand-gold/20 flex items-center justify-center gap-2 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Send Inquiry</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mortgage Calculator Modal */}
      <AnimatePresence>
        {showCalculator && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-7xl max-h-[90vh] overflow-auto bg-royal-deep rounded-3xl p-4 md:p-8 custom-scrollbar"
              data-lenis-prevent
            >
              <button
                onClick={() => setShowCalculator(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-zinc-100 transition-colors z-10"
                aria-label="Close Calculator"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-2xl md:text-3xl font-bold text-zinc-100 mb-6 md:mb-8">Mortgage Calculator</h2>
              <MortgageCalculator defaultPrice={property.price} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>


    </div>
  );
};

export default PropertyDetailClient;
