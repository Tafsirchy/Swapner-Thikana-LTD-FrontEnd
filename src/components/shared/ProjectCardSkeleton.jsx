import React from 'react';
import Skeleton from '@/components/shared/Skeleton';

const ProjectCardSkeleton = () => {
  return (
    <div className="bg-white/5 border border-white/10 overflow-hidden relative group h-full">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Skeleton className="w-full h-full rounded-none" />
      </div>

      {/* Content Skeleton - Offset Upwards */}
      <div className="p-4 sm:p-8 relative -mt-10 sm:-mt-12 md:-mt-20 z-10 mx-2 sm:mx-0">
        <div className="bg-royal-deep/90 backdrop-blur-2xl border border-white/10 p-5 sm:p-6 rounded-none shadow-2xl">
          {/* Title */}
          <Skeleton className="w-3/4 h-8 mb-4 border-l-2 border-transparent pl-3" />
          
          {/* Location */}
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="w-1/2 h-4" />
          </div>

          {/* Description */}
          <div className="space-y-2 mb-6">
            <Skeleton className="w-full h-3" />
            <Skeleton className="w-5/6 h-3" />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-white/5">
            <Skeleton className="w-1/3 h-4" />
            <Skeleton className="w-1/4 h-8 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCardSkeleton;
