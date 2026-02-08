'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import SmartImage from './SmartImage';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowRight, Heart, Plus, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import WishlistModal from './WishlistModal';
import { AnimatePresence } from 'framer-motion';
import LiquidButton from './LiquidButton';
import { addToCompare, removeFromCompare, subscribeToCompare } from '@/utils/compareStore';

const ProjectCard = ({ project }) => {
  const { user } = useAuth();
  const [isInCompare, setIsInCompare] = useState(false);
  const [showWishlistModal, setShowWishlistModal] = useState(false);

  const {
    _id,
    title,
    slug,
    location,
    status,
    images,
    description,
    completionDate
  } = project;

  const isSaved = useMemo(() => {
    return user?.savedProperties?.some(id => id === _id) || false;
  }, [user?.savedProperties, _id]);

  // Subscribe to comparison changes
  useEffect(() => {
    const unsubscribe = subscribeToCompare((list) => {
      setIsInCompare(list.some(p => p._id === _id));
    });
    return unsubscribe;
  }, [_id]);

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to save projects');
      return;
    }

    setShowWishlistModal(true);
  };

  const statusColors = {
    ongoing: 'bg-brand-gold text-royal-deep',
    completed: 'bg-brand-emerald text-white',
    upcoming: 'bg-brand-royal text-white'
  };

  return (
    <>
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="group relative bg-white/5 border border-white/10 overflow-hidden hover:border-brand-gold/30 transition-all duration-500"
    >
      <div className="relative aspect-[4/3] sm:h-80 w-full overflow-hidden">
        <SmartImage
          src={images?.[0] || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop'}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-royal-deep via-royal-deep/40 to-transparent"></div>
        
        <div className="absolute top-6 inset-x-6 flex items-start justify-between gap-4 z-10">
          <span className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest shadow-lg ${statusColors[status] || 'bg-zinc-800 text-white'}`}>
            {status}
          </span>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <LiquidButton 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isInCompare) {
                  removeFromCompare(_id);
                } else {
                  addToCompare(project);
                }
              }}
              baseColor={isInCompare ? 'bg-brand-emerald' : 'bg-white/10'}
              liquidColor={isInCompare ? 'fill-white/20' : 'fill-brand-emerald/40'}
              className={`backdrop-blur-md border shadow-lg w-11 h-11 !p-0 ${
                isInCompare ? 'border-brand-emerald text-white' : 'border-white/20 text-white'
              }`}
            >
              {isInCompare ? <Check size={16} /> : <Plus size={16} />}
            </LiquidButton>

            <LiquidButton 
              onClick={handleToggleWishlist}
              baseColor={isSaved ? 'bg-brand-gold' : 'bg-white/10'}
              liquidColor={isSaved ? 'fill-white/30' : 'fill-brand-gold/40'}
              className={`backdrop-blur-md border shadow-lg w-11 h-11 !p-0 ${
                isSaved ? 'border-brand-gold text-royal-deep' : 'border-white/20 text-white'
              }`}
            >
              <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} className={isSaved ? 'text-royal-deep' : 'text-white'} />
            </LiquidButton>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-8 relative -mt-12 sm:-mt-20 z-10 mx-2 sm:mx-0">
        <div className="bg-royal-deep/90 backdrop-blur-2xl border border-white/10 p-5 sm:p-6 rounded-none shadow-2xl transition-transform duration-500 group-hover:-translate-y-1">
          <h3 className="text-xl sm:text-2xl font-bold text-zinc-100 mb-2 sm:mb-3 leading-snug group-hover:text-brand-gold transition-colors">{title}</h3>
          
          <div className="flex items-center gap-2 text-zinc-400 text-xs sm:text-sm mb-4">
            <MapPin size={14} className="text-brand-gold" />
            <span>{location.city}</span>
          </div>

          <p className="text-zinc-400 text-xs sm:text-sm line-clamp-2 mb-6 italic leading-relaxed opacity-80">
            {description}
          </p>

          <div className="flex items-center justify-between pt-6 border-t border-white/5">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-brand-gold" />
              <span className="text-[10px] sm:text-xs font-medium text-zinc-300">Completion: {completionDate || 'TBA'}</span>
            </div>
            <Link 
              href={`/projects/${slug}`}
              className="flex items-center gap-1 text-brand-gold text-xs sm:text-sm font-black uppercase tracking-wider hover:gap-2 transition-all px-2 py-1 -mr-2"
            >
              More
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>

    <AnimatePresence>
      {showWishlistModal && (
        <WishlistModal 
          propertyId={_id}
          propertyTitle={title}
          onClose={() => setShowWishlistModal(false)}
        />
      )}
    </AnimatePresence>
  </>
  );
};

export default ProjectCard;
