import React from 'react';
import Skeleton from '@/components/shared/Skeleton';

const PropertyCardSkeleton = () => {
  return (
    <div className="group relative bg-card border border-white/10 overflow-hidden h-full flex flex-col relative">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/3] w-full overflow-hidden sm:m-2">
        <Skeleton className="w-full h-full rounded-none" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
           <Skeleton className="w-20 h-6 rounded-full" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-4 sm:p-6 flex flex-col flex-grow relative">
        {/* Price & Address */}
        <div className="mb-6">
          <Skeleton className="w-3/4 h-8 mb-2" />
          <div className="flex items-center gap-1.5 mb-6">
             <Skeleton className="w-4 h-4 rounded-full" />
             <Skeleton className="w-1/2 h-4" />
          </div>

          {/* Features Grid */}
          <div className="flex items-center justify-between pt-6 border-t border-white/5 mb-6">
            <div className="flex items-center gap-2">
               <Skeleton className="w-8 h-8 rounded-full mx-auto" />
               <Skeleton className="w-8 h-3" />
            </div>
            <div className="flex items-center gap-2">
               <Skeleton className="w-8 h-8 rounded-full mx-auto" />
               <Skeleton className="w-8 h-3" />
            </div>
            <div className="flex items-center gap-2">
               <Skeleton className="w-8 h-8 rounded-full mx-auto" />
               <Skeleton className="w-8 h-3" />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto">
          <Skeleton className="w-full h-11 rounded-none" />
        </div>
      </div>
    </div>
  );
};

export default PropertyCardSkeleton;
