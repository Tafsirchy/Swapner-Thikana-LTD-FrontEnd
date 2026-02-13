import React from 'react';
import Skeleton from '@/components/shared/Skeleton';

const PropertyCardSkeleton = () => {
  return (
    <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden h-full flex flex-col relative group">
      {/* Image Skeleton */}
      <div className="relative h-[250px] w-full overflow-hidden">
        <Skeleton className="w-full h-full rounded-none" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
           <Skeleton className="w-20 h-6 rounded-full" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-6 flex flex-col flex-grow relative">
        {/* Price & Address */}
        <div className="mb-6">
          <Skeleton className="w-3/4 h-8 mb-2" />
          <div className="flex items-center gap-2">
             <Skeleton className="w-4 h-4 rounded-full" />
             <Skeleton className="w-1/2 h-4" />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/5 mb-6">
          <div className="text-center px-2">
             <Skeleton className="w-8 h-8 rounded-full mx-auto mb-2" />
             <Skeleton className="w-12 h-3 mx-auto" />
          </div>
          <div className="text-center px-2 border-l border-white/5">
             <Skeleton className="w-8 h-8 rounded-full mx-auto mb-2" />
             <Skeleton className="w-12 h-3 mx-auto" />
          </div>
          <div className="text-center px-2 border-l border-white/5">
             <Skeleton className="w-8 h-8 rounded-full mx-auto mb-2" />
             <Skeleton className="w-12 h-3 mx-auto" />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto flex items-center justify-between gap-4 pt-4">
          <Skeleton className="w-1/3 h-10 rounded-xl" />
          <Skeleton className="w-1/3 h-10 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default PropertyCardSkeleton;
