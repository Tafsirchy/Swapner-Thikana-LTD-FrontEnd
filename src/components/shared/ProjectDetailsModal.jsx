'use client';

import React, { useEffect, useState } from 'react';
import { 
  X, MapPin, Building2, Calendar, 
  Phone, Facebook, ExternalLink, 
  Maximize2, ArrowRight, Home,
  CheckCircle2, Users, Layers,
  Compass, Milestone, Trees, Layout
} from 'lucide-react';
import Image from 'next/image';
import SmartImage from './SmartImage';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

const ProjectDetailsModal = ({ isOpen, onClose, project }) => {
  const { user } = useAuth();
  const [activeImage, setActiveImage] = useState(0);

  // Track recently viewed
  useEffect(() => {
    if (isOpen && project?._id && user) {
      api.user.addRecentlyViewed(project._id).catch(err => {
        console.error('Failed to track project view from modal:', err);
      });
    }
  }, [isOpen, project?._id, user]);

  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !project) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-royal-deep w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 shadow-2xl relative custom-scrollbar"
          onClick={(e) => e.stopPropagation()}
          data-lenis-prevent
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-3 bg-black/50 backdrop-blur-md rounded-xl text-white/70 hover:text-white hover:bg-black/70 transition-all border border-white/10 active:scale-95 shadow-xl"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Banner Image */}
          <div className="relative h-64 sm:h-80 w-full group">
            <SmartImage 
              src={project.thumbnail || '/placeholder-project.jpg'} 
              alt={project.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-royal-deep via-royal-deep/40 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-gold text-royal-deep text-[10px] font-bold uppercase tracking-wider mb-2">
                {project.type} • {project.status}
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 leading-tight">
                {project.title}
              </h2>
              <div className="flex items-center gap-2 text-zinc-300 text-sm">
                <MapPin size={16} className="text-brand-gold" />
                <span>{project.location?.address}, {project.location?.city}</span>
                {project.mapUrl && (
                  <a 
                    href={project.mapUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 inline-flex items-center gap-1.5 px-3 py-1 bg-brand-gold/10 hover:bg-brand-gold/20 rounded-lg text-brand-gold transition-all border border-brand-gold/20 text-xs font-bold"
                  >
                    <span>Google Maps</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-10 space-y-8 sm:space-y-12">
            {/* Description Section */}
            <div>
               <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                 <div className="w-1.5 h-6 bg-brand-gold rounded-full" />
                 Overview
               </h3>
               <p className="text-zinc-400 leading-relaxed text-base">
                 {project.description}
               </p>
            </div>

            {/* Technical Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
               <InfoCard icon={<Layers size={20}/>} label="Land Size" value={project.landSize || 'N/A'} />
               <InfoCard icon={<Building2 size={20}/>} label="Floor Config" value={project.floorConfiguration || 'N/A'} />
               <InfoCard icon={<Users size={20}/>} label="Total Units" value={project.totalUnits || 'N/A'} />
               <InfoCard icon={<Compass size={20}/>} label="Facing" value={project.facing || 'N/A'} />
               <InfoCard icon={<Milestone size={20}/>} label="Road Width" value={project.roadWidth || 'N/A'} />
               <InfoCard icon={<Trees size={20}/>} label="Surroundings" value={project.surroundings || 'N/A'} />
               <InfoCard icon={<Calendar size={20}/>} label="Handover" value={project.handoverDate || 'N/A'} />
               <InfoCard icon={<CheckCircle2 size={20}/>} label="Status" value={project.status || 'N/A'} />
            </div>

            {/* Apartment Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
               <div className="bg-white/5 rounded-3xl p-6 sm:p-8 border border-white/5">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 underline decoration-brand-gold/30 underline-offset-8">
                    <Layout size={20} className="text-brand-gold" />
                    Internal Configuration
                  </h3>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-zinc-400">Unit Sizes</span>
                        <span className="text-zinc-100 font-medium">{project.flatSize || 'N/A'}</span>
                     </div>
                     <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-4">
                        <RoomSpec label="Drawing" value={project.unitDetails?.drawingRoom} />
                        <RoomSpec label="Living" value={project.unitDetails?.livingRoom} />
                        <RoomSpec label="Dining" value={project.unitDetails?.dining} />
                        <RoomSpec label="Kitchen" value={project.unitDetails?.kitchen} />
                     </div>
                     <div className="grid grid-cols-1 xs:grid-cols-2 min-[480px]:grid-cols-3 gap-3 pt-2">
                        <div className="text-center p-3 bg-white/5 rounded-2xl border border-white/5">
                           <div className="text-brand-gold font-bold">{project.bedroomCount || '0'}</div>
                           <div className="text-[10px] uppercase text-zinc-500 font-bold">Bedrooms</div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-2xl border border-white/5">
                           <div className="text-brand-gold font-bold">{project.bathroomCount || '0'}</div>
                           <div className="text-[10px] uppercase text-zinc-500 font-bold">Bathrooms</div>
                        </div>
                        <div className="text-center p-3 bg-white/5 rounded-2xl border border-white/5 col-span-2 xs:col-span-1">
                           <div className="text-brand-gold font-bold">{project.balconyCount || '0'}</div>
                           <div className="text-[10px] uppercase text-zinc-500 font-bold">Balconies</div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-white/5 rounded-3xl p-6 sm:p-8 border border-white/5">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 underline decoration-brand-gold/30 underline-offset-8">
                    <Building2 size={20} className="text-brand-gold" />
                    Building Amenities
                  </h3>
                  <div className="space-y-4">
                     <AmenityRow label="Parking" value={project.parking} />
                     <AmenityRow label="Lift/Elevator" value={project.lift} />
                     <AmenityRow label="Staircase" value={project.stair} />
                     <div className="mt-4">
                        <label className="text-xs text-zinc-500 font-bold uppercase mb-2 block">Common Facilities</label>
                        <p className="text-zinc-300 text-sm leading-relaxed italic">{project.commonFacilities || 'Available for residents'}</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Sales & Contact Information */}
            <div className="bg-brand-gold/5 border border-brand-gold/10 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="space-y-2 text-center md:text-left">
                  <h4 className="text-xl sm:text-2xl font-bold text-brand-gold uppercase tracking-tight">Interested in this project?</h4>
                  <p className="text-zinc-400">Get in touch with our sales team for availability and current rates.</p>
                  <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                     <span className="px-4 py-2 bg-royal-deep/80 rounded-full border border-brand-gold/20 text-brand-gold-light font-bold text-sm">
                        Rate: {project.pricePerSqFt || 'Contact for Price'}
                     </span>
                     <span className="px-4 py-2 bg-royal-deep/80 rounded-full border border-brand-gold/20 text-brand-gold-light font-bold text-sm">
                        Availabile: {project.availableFlats || 'Check with Sales'}
                     </span>
                  </div>
               </div>
               
               <div className="flex flex-col gap-3 w-full md:w-auto">
                  {project.contact?.phone && (
                    <a 
                      href={`tel:${project.contact.phone}`} 
                      className="px-8 py-3 bg-brand-gold text-royal-deep font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-brand-gold-light transition-all shadow-xl shadow-brand-gold/20"
                    >
                      <Phone size={18} />
                      {project.contact.phone}
                    </a>
                  )}
                  {project.contact?.facebook && (
                    <a 
                      href={project.contact.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-8 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                    >
                      <Facebook size={18} className="text-[#1877F2]" />
                      Facebook Page
                    </a>
                  )}
                  <button className="text-xs text-zinc-500 hover:text-brand-gold transition-colors font-bold uppercase tracking-widest mt-2">
                    Request Site Visit
                  </button>
               </div>
            </div>

            {/* Gallery Portfolio */}
            {project.images?.length > 0 && (
              <div className="space-y-6">
                 <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-brand-gold rounded-full" />
                    Project Portfolio
                 </h3>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {project.images.map((img, idx) => (
                       <motion.div 
                          key={idx}
                          whileHover={{ scale: 1.05 }}
                          className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer bg-white/5 border border-white/5"
                          onClick={() => setActiveImage(idx)}
                       >
                           <SmartImage 
                              src={img} 
                              alt="" 
                              fill 
                              className="object-cover" 
                           />
                       </motion.div>
                    ))}
                 </div>
              </div>
            )}

            {/* Key Features List */}
            {project.features?.length > 0 && (
              <div className="space-y-6">
                 <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-brand-gold rounded-full" />
                    Key Features
                 </h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                    {project.features.map((feature, idx) => (
                       <div key={idx} className="flex items-start gap-3">
                          <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full border border-brand-gold/50 flex items-center justify-center">
                             <div className="w-1.5 h-1.5 bg-brand-gold rounded-full" />
                          </div>
                          <span className="text-zinc-400 text-sm">{feature}</span>
                       </div>
                    ))}
                 </div>
              </div>
            )}
            
            {/* Brochure Link */}
            {project.brochureUrl && (
              <div className="pt-6 border-t border-white/5">
                <a 
                  href={project.brochureUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-gold-light font-bold text-sm tracking-widest uppercase group"
                >
                  Download Project Brochure
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            )}
          </div>

          {/* Footer Branding */}
          <div className="p-8 border-t border-white/5 text-center">
             <div className="flex flex-col items-center gap-2">
                <div className="text-brand-gold font-bold italic text-lg">SHWAPNER THIKANA</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">Building Legacies Since 2012</div>
             </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-1 group hover:border-brand-gold/20 transition-all">
    <div className="text-brand-gold mb-1 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="text-[10px] uppercase text-zinc-500 font-bold tracking-tight">{label}</div>
    <div className="text-zinc-100 font-bold text-sm truncate w-full">{value}</div>
  </div>
);

const RoomSpec = ({ label, value }) => (
  <div className="flex justify-between items-center px-4 py-2 bg-royal-deep rounded-xl border border-white/5">
    <span className="text-xs text-zinc-500 uppercase font-bold">{label}</span>
    <span className="text-zinc-200 text-sm font-medium">{value || 'Yes'}</span>
  </div>
);

const AmenityRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
     <span className="text-zinc-400 text-sm">{label}</span>
     <span className="text-zinc-100 font-bold text-sm">{value || 'Available'}</span>
  </div>
);

export default ProjectDetailsModal;
