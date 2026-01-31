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
      className="group relative bg-white/5 border border-white/10 rounded-none overflow-hidden hover:border-brand-gold/30 transition-all duration-500"
    >
      <div className="relative h-80 w-full">
        <SmartImage
          src={images?.[0] || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop'}
          alt={title}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-royal-deep via-royal-deep/40 to-transparent"></div>
        
        <div className="absolute top-6 inset-x-6 flex items-start justify-between gap-4 z-10">
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg ${statusColors[status] || 'bg-zinc-800 text-white'}`}>
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
              rounded="rounded-full"
              px="!p-2.5"
              py="!p-2.5"
              className={`backdrop-blur-md border shadow-lg ${
                isInCompare ? 'border-brand-emerald text-white' : 'border-white/20 text-white'
              }`}
            >
              {isInCompare ? <Check size={16} /> : <Plus size={16} />}
            </LiquidButton>

            <LiquidButton 
              onClick={handleToggleWishlist}
              baseColor={isSaved ? 'bg-brand-gold' : 'bg-white/10'}
              liquidColor={isSaved ? 'fill-white/30' : 'fill-brand-gold/40'}
              rounded="rounded-full"
              px="!p-2.5"
              py="!p-2.5"
              className={`backdrop-blur-md border shadow-lg ${
                isSaved ? 'border-brand-gold text-royal-deep' : 'border-white/20 text-white'
              }`}
            >
              <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} className={isSaved ? 'text-royal-deep' : 'text-white'} />
            </LiquidButton>
          </div>
        </div>
      </div>

      <div className="p-8 relative -mt-20 z-10">
        <div className="bg-royal-deep/80 backdrop-blur-xl border border-white/10 p-6 rounded-none shadow-2xl">
          <h3 className="text-2xl font-bold text-zinc-100 mb-3 group-hover:text-brand-gold transition-colors">{title}</h3>
          
          <div className="flex items-center gap-2 text-zinc-400 text-sm mb-4">
            <MapPin size={16} className="text-brand-gold" />
            <span>{location.city}</span>
          </div>

          <p className="text-zinc-400 text-sm line-clamp-2 mb-6 italic leading-relaxed">
            {description}
          </p>

          <div className="flex items-center justify-between pt-6 border-t border-white/5">
            <div className="flex items-center gap-1">
              <Calendar size={16} className="text-brand-gold" />
              <span className="text-xs font-medium text-zinc-300">Completion: {completionDate || 'TBA'}</span>
            </div>
            <Link 
              href={`/projects/${slug}`}
              className="flex items-center gap-2 text-brand-gold text-sm font-bold hover:gap-3 transition-all"
            >
              Learn More
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
