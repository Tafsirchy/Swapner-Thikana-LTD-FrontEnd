'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Building2, MapPin, CheckCircle2, 
  Phone, Send, Loader2
} from 'lucide-react';
import LiquidButton from '../shared/LiquidButton';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

const ProjectDetailClient = ({ project }) => {
  const [inquiry, setInquiry] = useState({
    name: '',
    phone: '',
    email: '',
    message: `I am interested in ${project?.title}. Please contact me with more information.`,
    propertyId: project?._id,
    interestType: 'project'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.leads.create(inquiry);
      toast.success('Your inquiry has been received. Our team will contact you soon.');
      setInquiry({ ...inquiry, name: '', phone: '', email: '', message: '' });
    } catch (err) {
      console.error('Inquiry error:', err);
      toast.error('Failed to send inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
          priority
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

      <div className="max-container px-4 mt-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* 1. Project Overview & Address */}
            <div className="space-y-6 border-b border-white/5 pb-10">
              <h2 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
                <span className="w-10 h-1 bg-brand-gold rounded-full"></span>
                Project Overview
              </h2>
              <div className="text-zinc-400 text-lg leading-relaxed italic">
                {project.description}
              </div>
              <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10 mt-4">
                 <MapPin className="text-brand-gold shrink-0 mt-1" size={20} />
                 <div>
                    <span className="block text-xs text-zinc-500 uppercase tracking-widest font-bold mb-1">Project Address</span>
                    <p className="text-zinc-200 font-medium">{project.address || project.location?.address || "Plot No# 02, Road# 04. Sector# 15/E"}</p>
                 </div>
              </div>
            </div>

            {/* 2. Key Project Metrics (Grid) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Land Size", value: project.landSize || "6 Katha" },
                { label: "Floor Config", value: project.floorConfiguration || "G+9" },
                { label: "Total Units", value: project.totalUnits || "18 Nos." },
                { label: "Units / Floor", value: project.unitsPerFloor || "2 Units" },
                { label: "Parking", value: project.parking || "1 per Flat" },
                { label: "Lift", value: project.lift || "1 Lift" },
                { label: "Stair", value: project.stair || "Yes" },
                { label: "Handover", value: project.handoverDate || "Dec 2027" },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-zinc-900/50 border border-white/5 rounded-2xl flex flex-col gap-1 hover:border-brand-gold/20 transition-colors">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">{item.label}</span>
                  <span className="text-zinc-100 font-bold text-sm md:text-base">{item.value}</span>
                </div>
              ))}
            </div>

            {/* 3. Apartment Configuration & Size */}
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 space-y-8">
               <div>
                  <h3 className="text-xl font-bold text-zinc-100 mb-2 flex items-center gap-2">
                     <Building2 className="text-brand-gold" size={20} />
                     Apartment Configuration
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                     <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/5">
                        <span className="block text-brand-gold font-bold mb-1">Unit Sizes</span>
                        <p className="text-zinc-300 text-sm">{project.flatSize || "A Unit: 1950 Sft, B Unit: 1750 Sft"}</p>
                     </div>
                     <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/5">
                        <span className="block text-brand-gold font-bold mb-1">Common Facilities</span>
                        <p className="text-zinc-300 text-sm">{project.commonFacilities || "Rooftop Community Area, Hall Room, BBQ Facility"}</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest border-b border-white/10 pb-2">Apartment Features</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8">
                     {[
                        { label: "Bedroom", value: project.bedroomCount || "3/4" },
                        { label: "Bathroom", value: project.bathroomCount || "3/4" },
                        { label: "Drawing", value: "Included" },
                        { label: "Living", value: "Included" },
                        { label: "Family Living", value: "Included" },
                        { label: "Dining", value: "Included" },
                        { label: "Balcony", value: project.balconyCount || "2/3" },
                        { label: "Kitchen", value: "Included" },
                     ].map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-zinc-300">
                           <CheckCircle2 size={14} className="text-brand-gold/60" />
                           <span className="text-sm">
                              <span className="text-zinc-500 text-xs mr-1">{feat.label}:</span> 
                              {feat.value}
                           </span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

             {/* 4. Availability & Rate */}
             <div className="space-y-6">
               <h3 className="text-2xl font-bold text-zinc-100">Pricing & Availability</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-3xl bg-brand-gold/10 border border-brand-gold/20 flex flex-col justify-center items-center text-center">
                     <span className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-2">Price Rate</span>
                     <span className="text-3xl font-bold text-white">{project.pricePerSqFt || "9,500"}</span>
                     <span className="text-sm text-zinc-400 mt-1">BDT per SFT</span>
                  </div>
                  <div className="p-6 rounded-3xl bg-zinc-900 border border-white/10">
                     <span className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4 block">Available Units</span>
                     <p className="text-zinc-300 font-medium leading-relaxed">
                        {project.availableFlats || "3A, 3B (2nd Floor), 5A (4th Floor), 8A (9th Floor)"}
                     </p>
                  </div>
               </div>
             </div>

            {/* Gallery */}
            <div className="space-y-6 pt-8 border-t border-white/5">
              <h2 className="text-2xl font-bold text-zinc-100">Visual Portfolio</h2>
              <div className="grid grid-cols-2 gap-4">
                {project.images?.map((img, i) => (
                  <div key={i} className="relative h-64 rounded-3xl overflow-hidden group border border-white/5">
                    <Image src={img} alt="" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="p-8 glass rounded-[2.5rem] border-brand-gold/20 sticky top-28">
              <h3 className="text-xl font-bold text-zinc-100 mb-2">Direct Contact</h3>
              <p className="text-zinc-400 text-sm mb-6">Speak directly with our sales team.</p>
              
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-gold/20 transition-all">
                   <div className="flex items-center gap-3 mb-2">
                     <Phone size={16} className="text-brand-gold" />
                     <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Hotline</span>
                   </div>
                   <p className="text-xl font-bold text-zinc-100">01731 227 755</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-gold/20 transition-all">
                   <div className="flex items-center gap-3 mb-2">
                     <Building2 size={16} className="text-brand-gold" />
                     <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Dhaka Office</span>
                   </div>
                   <p className="text-xl font-bold text-zinc-100">01822 335 566</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <h4 className="text-sm font-bold text-zinc-100 mb-4">Request Callback</h4>
                <form className="space-y-3" onSubmit={handleInquirySubmit}>
                  <input 
                    type="text" 
                    required
                    placeholder="Full Name" 
                    className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold/50 transition-colors text-zinc-100" 
                    value={inquiry.name}
                    onChange={(e) => setInquiry({...inquiry, name: e.target.value})}
                  />
                  <input 
                    type="email" 
                    required
                    placeholder="Email Address" 
                    className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold/50 transition-colors text-zinc-100" 
                    value={inquiry.email}
                    onChange={(e) => setInquiry({...inquiry, email: e.target.value})}
                  />
                  <input 
                    type="tel" 
                    required
                    placeholder="Phone Number" 
                    className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold/50 transition-colors text-zinc-100" 
                    value={inquiry.phone}
                    onChange={(e) => setInquiry({...inquiry, phone: e.target.value})}
                  />
                  <LiquidButton 
                    type="submit"
                    disabled={submitting}
                    className="w-full mt-2 shadow-lg flex items-center justify-center gap-2"
                  >
                    {submitting ? <Loader2 size={18} className="animate-spin" /> : <><Send size={18} /> Request Info</>}
                  </LiquidButton>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectDetailClient;
