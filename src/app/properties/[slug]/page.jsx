'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { 
  MapPin, Bed, Bath, Move, Heart, Share2, 
  Calendar, CheckCircle2, ShieldCheck,
  ChevronLeft, ChevronRight, Loader2, Send, Calculator, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import MortgageCalculator from '@/components/tools/MortgageCalculator';

// Dynamic import for map (client-side only)
const PropertyMap = dynamic(() => import('@/components/map/PropertyMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
      <Loader2 className="animate-spin text-brand-gold" size={32} />
    </div>
  )
});

const PropertyDetailPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  
  // Inquiry Form State
  const [inquiry, setInquiry] = useState({
    name: '',
    email: '',
    phone: '',
    message: 'I am interested in this luxury property. Please contact me with more details.',
    propertyId: '',
    interestType: 'property'
  });
  const [submitting, setSubmitting] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  const fetchProperty = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.properties.getBySlug(slug);
      setProperty(data.data.property);
      setInquiry(prev => ({ ...prev, propertyId: data.data.property._id }));
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Property not found');
      router.push('/properties');
    } finally {
      setLoading(false);
    }
  }, [slug, router]);

  useEffect(() => {
    fetchProperty();
  }, [slug, fetchProperty]);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.leads.create(inquiry);
      toast.success('Your inquiry has been sent to the agent.');
      setInquiry({ ...inquiry, name: '', email: '', phone: '', message: '' });
    } catch (err) {
      toast.error('Failed to send inquiry. Please try again.');
      console.error('Inquiry error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-royal-deep">
        <Loader2 size={48} className="text-brand-gold animate-spin" />
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="min-h-screen bg-royal-deep pt-24 pb-20">
      {/* Dynamic Header / Gallery Section */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <Image 
          src={property.images?.[activeImage] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop'} 
          alt={property.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-royal-deep via-transparent to-transparent"></div>
        
        {/* Navigation Overlays */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-8">
          <button 
            onClick={() => setActiveImage(prev => (prev === 0 ? property.images.length - 1 : prev - 1))}
            className="p-4 rounded-full glass border-white/20 text-white hover:bg-brand-gold hover:text-royal-deep transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => setActiveImage(prev => (prev === property.images.length - 1 ? 0 : prev + 1))}
            className="p-4 rounded-full glass border-white/20 text-white hover:bg-brand-gold hover:text-royal-deep transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Thumbnail Strip */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 p-2 glass rounded-2xl border-white/10 overflow-x-auto max-w-[90vw]">
          {property.images?.map((img, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveImage(idx)}
              className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${activeImage === idx ? 'border-brand-gold' : 'border-transparent opacity-60'}`}
            >
              <Image src={img} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      </section>

      <div className="max-container px-4 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Title & Price Header */}
            <div className="p-10 glass rounded-[3rem] border-white/10">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-4 py-1.5 bg-brand-gold text-royal-deep text-[10px] font-bold uppercase tracking-widest rounded-full">
                  {property.propertyType}
                </span>
                <span className="px-4 py-1.5 bg-white/5 text-zinc-300 text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/10">
                  {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
                </span>
                {property.featured && (
                  <span className="px-4 py-1.5 bg-brand-emerald text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                    Platinum Collection
                  </span>
                )}
              </div>

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-bold text-zinc-100">{property.title}</h1>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <MapPin size={20} className="text-brand-gold" />
                    <span className="text-lg">{property.location.address}, {property.location.area}, {property.location.city}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-zinc-500 text-sm font-bold uppercase tracking-widest mb-1">Asking Price</span>
                  <div className="text-4xl font-bold text-brand-gold">
                    ৳ {property.price?.toLocaleString('en-BD')}
                    {property.listingType === 'rent' && <span className="text-lg text-zinc-400 font-normal ml-1">/ month</span>}
                  </div>
                </div>
              </div>

              {/* Quick Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-10 border-t border-white/5">
                <div className="flex flex-col items-center gap-2">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <Bed size={24} className="text-brand-gold" />
                  </div>
                  <span className="text-lg font-bold text-zinc-100">{property.bedrooms} <span className="text-sm font-normal text-zinc-500">Beds</span></span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <Bath size={24} className="text-brand-gold" />
                  </div>
                  <span className="text-lg font-bold text-zinc-100">{property.bathrooms} <span className="text-sm font-normal text-zinc-500">Baths</span></span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <Move size={24} className="text-brand-gold" />
                  </div>
                  <span className="text-lg font-bold text-zinc-100">{property.size} <span className="text-sm font-normal text-zinc-500">Sqft</span></span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <Calendar size={24} className="text-brand-gold" />
                  </div>
                  <span className="text-lg font-bold text-zinc-100">2023 <span className="text-sm font-normal text-zinc-500">Built</span></span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-10 bg-white/5 rounded-[3rem] border border-white/10">
              <h2 className="text-2xl font-bold text-zinc-100 mb-6 pb-4 border-b border-white/10">About This Residence</h2>
              <div className="text-zinc-400 leading-relaxed space-y-4">
                {property.description?.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="p-10 bg-white/5 rounded-[3rem] border border-white/10">
              <h2 className="text-2xl font-bold text-zinc-100 mb-6 pb-4 border-b border-white/10">Exclusive Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                {property.amenities?.map((amenity, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-brand-emerald" />
                    <span className="text-zinc-300 font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location & Map */}
            <div className="p-10 bg-white/5 rounded-[3rem] border border-white/10">
              <h2 className="text-2xl font-bold text-zinc-100 mb-6 pb-4 border-b border-white/10 flex items-center gap-3">
                <MapPin className="text-brand-gold" size={28} />
                Location
              </h2>
              <div className="mb-6 space-y-2">
                <p className="text-zinc-300">
                  <span className="font-semibold text-zinc-200">Address:</span> {property.location.address}
                </p>
                <p className="text-zinc-300">
                  <span className="font-semibold text-zinc-200">Area:</span> {property.location.area}, {property.location.city}
                </p>
              </div>
              <PropertyMap property={property} height="450px" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Inquiry Form */}
            <div className="p-8 glass rounded-[2.5rem] border-brand-gold/20 shadow-xl shadow-brand-gold/5 sticky top-28">
              <h3 className="text-xl font-bold text-zinc-100 mb-6 flex items-center gap-2">
                <ShieldCheck className="text-brand-gold" size={24} />
                Exclusive Inquiry
              </h3>
              
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <input 
                  type="text" 
                  required
                  placeholder="Your Full Name" 
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-gold/50 outline-none text-zinc-100"
                  value={inquiry.name}
                  onChange={(e) => setInquiry({...inquiry, name: e.target.value})}
                />
                <input 
                  type="email" 
                  required
                  placeholder="Email Address" 
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-gold/50 outline-none text-zinc-100"
                  value={inquiry.email}
                  onChange={(e) => setInquiry({...inquiry, email: e.target.value})}
                />
                <input 
                  type="tel" 
                  required
                  placeholder="Phone Number" 
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-gold/50 outline-none text-zinc-100"
                  value={inquiry.phone}
                  onChange={(e) => setInquiry({...inquiry, phone: e.target.value})}
                />
                <textarea 
                  rows="4"
                  required
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-gold/50 outline-none text-zinc-100 resize-none"
                  value={inquiry.message}
                  onChange={(e) => setInquiry({...inquiry, message: e.target.value})}
                ></textarea>
                <button 
                  disabled={submitting}
                  className="w-full py-4 bg-brand-gold text-royal-deep font-bold rounded-xl hover:bg-brand-gold-light transition-all active:scale-95 shadow-lg shadow-brand-gold/20 flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Send Inquiry</>}
                </button>
              </form>
              
              <p className="text-[10px] text-zinc-500 mt-6 text-center italic">
                By submitting, you agree to our concierge privacy protocols.
              </p>
            </div>

            {/* Mortgage Calculator Button */}
            {property.listingType === 'sale' && (
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
            )}

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

      {/* Mortgage Calculator Modal */}
      <AnimatePresence>
        {showCalculator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-7xl max-h-[90vh] overflow-auto bg-royal-deep rounded-3xl p-8"
            >
              <button
                onClick={() => setShowCalculator(false)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-zinc-100 transition-colors z-10"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-3xl font-bold text-zinc-100 mb-8">Mortgage Calculator</h2>
              <MortgageCalculator defaultPrice={property.price} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyDetailPage;
